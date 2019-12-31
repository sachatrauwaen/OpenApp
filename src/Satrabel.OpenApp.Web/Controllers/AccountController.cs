using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Abp;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Notifications;
using Abp.Threading;
using Abp.Timing;
using Abp.UI;
using Abp.Web.Models;
using Abp.Zero.Configuration;
using Satrabel.OpenApp.Authorization;
using Satrabel.OpenApp.MultiTenancy;
using Satrabel.OpenApp.Web.Models.Account;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.Controllers;
using Satrabel.OpenApp.Identity;
using Satrabel.OpenApp.Sessions;
using Microsoft.AspNetCore.Authentication;
using Satrabel.OpenApp.Web.Views.Shared.Components.TenantChange;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Runtime.Security;
using System.Globalization;
using Abp.Runtime.Caching;

namespace Satrabel.OpenApp.Web.Controllers
{
    public class AccountController : OpenAppControllerBase
    {
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IMultiTenancyConfig _multiTenancyConfig;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly LogInManager _logInManager;
        private readonly SignInManager _signInManager;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly ISessionAppService _sessionAppService;
        private readonly ITenantCache _tenantCache;
        private readonly INotificationPublisher _notificationPublisher;
        private readonly ICacheManager _cacheManager;

        public AccountController(
            UserManager userManager,
            IMultiTenancyConfig multiTenancyConfig,
            TenantManager tenantManager,
            IUnitOfWorkManager unitOfWorkManager,
            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            LogInManager logInManager,
            SignInManager signInManager,
            UserRegistrationManager userRegistrationManager,
            ISessionAppService sessionAppService,
             ICacheManager cacheManager,
            ITenantCache tenantCache,
            
        INotificationPublisher notificationPublisher)
        {
            _userManager = userManager;
            _multiTenancyConfig = multiTenancyConfig;
            _tenantManager = tenantManager;
            _unitOfWorkManager = unitOfWorkManager;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _logInManager = logInManager;
            _signInManager = signInManager;
            _userRegistrationManager = userRegistrationManager;
            _sessionAppService = sessionAppService;
            _tenantCache = tenantCache;
            _notificationPublisher = notificationPublisher;
            _cacheManager = cacheManager;
        }

        #region Login / Logout

        public ActionResult Login(string userNameOrEmailAddress = "", string returnUrl = "", string successMessage = "")
        {
            if (string.IsNullOrWhiteSpace(returnUrl))
            {
                returnUrl = GetAppHomeUrl();
            }

            return View( new LoginFormViewModel
            {
                ReturnUrl = returnUrl,
                IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled,
                IsSelfRegistrationAllowed = IsSelfRegistrationEnabled(),
                MultiTenancySide = AbpSession.MultiTenancySide
            });
        }

        [HttpPost]
        [UnitOfWork]
        public virtual async Task<JsonResult> Login(LoginViewModel loginModel, string returnUrl = "", string returnUrlHash = "")
        {
            returnUrl = NormalizeReturnUrl(returnUrl);
            if (!string.IsNullOrWhiteSpace(returnUrlHash))
            {
                returnUrl = returnUrl + returnUrlHash;
            }

            var loginResult = await GetLoginResultAsync(loginModel.UsernameOrEmailAddress, loginModel.Password, GetTenancyNameOrNull(loginModel.TenancyName));

            await _signInManager.SignInAsync(loginResult.Identity, loginModel.RememberMe);
            await UnitOfWorkManager.Current.SaveChangesAsync();

            return Json(new AjaxResponse { TargetUrl = returnUrl });
        }

        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login");
        }


        private async Task<AbpLoginResult<Tenant, User>> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _logInManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    return loginResult;
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        #endregion

        #region Register

        public ActionResult Register()
        {
            return RegisterView(new RegisterViewModel());
        }

        private ActionResult RegisterView(RegisterViewModel model)
        {
            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;

            return View("Register", model);
        }

        private bool IsSelfRegistrationEnabled()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return false; // No registration enabled for host users!
            }

            return true;
        }

        [HttpPost]
        [UnitOfWork]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            try
            {
                ExternalLoginInfo externalLoginInfo = null;
                if (model.IsExternalLogin)
                {
                    externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
                    if (externalLoginInfo == null)
                    {
                        throw new Exception("Can not external login!");
                    }

                    model.UserName = model.EmailAddress;
                    model.Password = Authorization.Users.User.CreateRandomPassword();
                }
                else
                {
                    if (model.UserName.IsNullOrEmpty() || model.Password.IsNullOrEmpty())
                    {
                        throw new UserFriendlyException(L("FormIsNotValidMessage"));
                    }
                }

                //Getting tenant-specific settings
                var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

                var user = await _userRegistrationManager.RegisterAsync(
                    model.Name,
                    model.Surname,
                    model.EmailAddress,
                    model.UserName,
                    model.Password,
                    // true // Assumed email address is always confirmed. Change this if you want to implement email confirmation.
                    isEmailConfirmationRequiredForLogin ? false : true // We assume that when email confirmation is required before logging in, we create users under the assumption they still need to confirm
                );

                if (model.IsExternalLogin)
                {
                    Debug.Assert(externalLoginInfo != null);

                    if (string.Equals(externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email), model.EmailAddress, StringComparison.OrdinalIgnoreCase))
                    {
                        user.IsEmailConfirmed = true;
                    }

                    user.Logins = new List<UserLogin>
                    {
                        new UserLogin
                        {
                            LoginProvider = externalLoginInfo.LoginProvider,
                            ProviderKey = externalLoginInfo.ProviderKey,
                            TenantId = user.TenantId
                        }
                    };
                }

                await _unitOfWorkManager.Current.SaveChangesAsync();

                Debug.Assert(user.TenantId != null);

                var tenant = await _tenantManager.GetByIdAsync(user.TenantId.Value);

                var loginSuccessfull = await AttemptLogin(user, tenant, model.Password, isEmailConfirmationRequiredForLogin, externalLoginInfo);
                if (loginSuccessfull)
                    return Redirect(GetAppHomeUrl());

                return View("RegisterResult", new RegisterResultViewModel
                {
                    TenancyName = tenant.TenancyName,
                    NameAndSurname = user.Name + " " + user.Surname,
                    UserName = user.UserName,
                    EmailAddress = user.EmailAddress,
                    IsEmailConfirmed = user.IsEmailConfirmed,
                    IsActive = user.IsActive,
                    IsEmailConfirmationRequiredForLogin = isEmailConfirmationRequiredForLogin
                });
            }
            catch (UserFriendlyException ex)
            {
                ViewBag.ErrorMessage = ex.Message;

                return View("Register", model);
            }
        }

        private async Task<bool> AttemptLogin(User user, Tenant tenant, string password, bool isEmailConfirmationRequiredForLogin, ExternalLoginInfo externalLoginInfo)
        {
            if (user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin))
            {
                AbpLoginResult<Tenant, User> loginResult;
                if (externalLoginInfo != null)
                {
                    loginResult = await _logInManager.LoginAsync(externalLoginInfo, tenant.TenancyName);
                }
                else
                {
                    loginResult = await GetLoginResultAsync(user.UserName, password, tenant.TenancyName);
                }

                if (loginResult.Result == AbpLoginResultType.Success)
                {
                    await _signInManager.SignInAsync(loginResult.Identity, false);
                    return true;
                }

                Logger.Warn("New registered user could not be login. This should not be normally. login result: " + loginResult.Result);
            }

            return false;
        }

        public async Task<ActionResult> Confirm(int userId, int? tenantId, string code)
        {
            // TODO decrypt values

            if (tenantId != null)
                CurrentUnitOfWork.SetTenantId(tenantId);

            var user = await _userManager.GetUserByIdAsync(userId);

            var correctCode = user.EmailConfirmationCode == code;

            // 1. Incorrect code?

            if (correctCode == false)
                return RedirectToAction("Login", "Account");

            // 2. Correct code?

            // Update user
            user.IsEmailConfirmed = true;
            await _userManager.UpdateAsync(user);

            // Login user
            var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);
            var tenant = await _tenantManager.GetByIdAsync(user.TenantId.Value);
            var loginSuccessfull = await AttemptLogin(user, tenant, user.Password, isEmailConfirmationRequiredForLogin, null);

            // Redirect
            return loginSuccessfull
                ? (ActionResult)Redirect(GetAppHomeUrl())
                : (ActionResult)RedirectToAction("Login", "Account");
        }

        #endregion

        #region External Login

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            //var redirectUrl = Url.Action(
            //    "ExternalLoginCallback",
            //    "Account",
            //    new
            //    {
            //        ReturnUrl = returnUrl,
            //        authSchema = provider
            //    });

            //return Challenge(
            //     new AuthenticationProperties()
            //     {
            //         Items = { { "LoginProvider", provider } },
            //         RedirectUri = redirectUrl
            //     },
            //    provider
            //);
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);

            return Challenge(properties, provider);

        }

        [UnitOfWork]
        //[HttpGet]
        //[AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)

        //public virtual async Task<ActionResult> ExternalLoginCallback(string returnUrl, string authSchema, string remoteError = null)
        {
            returnUrl = NormalizeReturnUrl(returnUrl);

            if (remoteError != null)
            {
                Logger.Error("Remote Error in ExternalLoginCallback: " + remoteError);
                throw new UserFriendlyException(L("CouldNotCompleteLoginOperation"));
            }

            //var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync(authSchema);
            var externalLoginInfo = await _signInManager.GetExternalLoginInfoAsync();
            if (externalLoginInfo == null)
            {
                Logger.Warn("Could not get information from external login.");
                return RedirectToAction(nameof(Login));
            }

            await _signInManager.SignOutAsync();

            var tenancyName = GetTenancyNameOrNull();

            var loginResult = await _logInManager.LoginAsync(externalLoginInfo, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    await _signInManager.SignInAsync(loginResult.Identity, false);
                    return Redirect(returnUrl);
                case AbpLoginResultType.UnknownExternalLogin:
                    return await RegisterForExternalLogin(externalLoginInfo);
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(
                        loginResult.Result,
                        externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email) ?? externalLoginInfo.ProviderKey,
                        tenancyName
                    );
            }
        }

        private async Task<ActionResult> RegisterForExternalLogin(ExternalLoginInfo externalLoginInfo)
        {
            var email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email);
            var nameinfo = ExternalLoginInfoHelper.GetNameAndSurnameFromClaims(externalLoginInfo.Principal.Claims.ToList());

            var viewModel = new RegisterViewModel
            {
                EmailAddress = email,
                Name = nameinfo.name,
                Surname = nameinfo.surname,
                IsExternalLogin = true,
                ExternalLoginAuthSchema = externalLoginInfo.LoginProvider
            };

            if (nameinfo.name != null &&
                nameinfo.surname != null &&
                email != null)
            {
                return await Register(viewModel);
            }

            return RegisterView(viewModel);
        }

        [UnitOfWork]
        protected virtual async Task<List<Tenant>> FindPossibleTenantsOfUserAsync(UserLoginInfo login)
        {
            List<User> allUsers;
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                allUsers = await _userManager.FindAllAsync(login);
            }

            return allUsers
                .Where(u => u.TenantId != null)
                .Select(u => AsyncHelper.RunSync(() => _tenantManager.FindByIdAsync(u.TenantId.Value)))
                .ToList();
        }

        #endregion

        #region Helpers

        public ActionResult RedirectToAppHome()
        {
            return RedirectToAction("Index", "Home");
        }

        public string GetAppHomeUrl()
        {
            return Url.Action("Index", "Home");
        }

        #endregion

        #region Change Tenant

        public async Task<ActionResult> TenantChangeModal()
        {
            var loginInfo = await _sessionAppService.GetCurrentLoginInformations();
            return View("/Views/Shared/Components/TenantChange/_ChangeModal.cshtml", new ChangeModalViewModel
            {
                TenancyName = loginInfo.Tenant?.TenancyName
            });
        }

        #endregion

        #region Impersonate
        [UnitOfWork]
        public virtual async Task<ActionResult> ImpersonateSignIn(string tokenId)
        {
            var cacheItem = await _cacheManager.GetImpersonationCache().GetOrDefaultAsync(tokenId);
            if (cacheItem == null)
            {
                throw new UserFriendlyException(L("ImpersonationTokenErrorMessage"));
            }

            //Switch to requested tenant
            //using (_unitOfWorkManager.Current.SetFilterParameter(AbpDataFilters.MayHaveTenant, AbpDataFilters.Parameters.TenantId, cacheItem.TargetTenantId))
            using (_unitOfWorkManager.Current.SetTenantId( cacheItem.TargetTenantId))
            {
                //Get the user from tenant
                var user = await _userManager.FindByIdAsync(cacheItem.TargetUserId.ToString());

                //var tenant = await _tenantManager.FindByIdAsync(user.TenantId.Value);

                //Create identity
                //var identity = await _userManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
                var principal = await _signInManager.ClaimsFactory.CreateAsync(user);
                var identity = principal.Identity as ClaimsIdentity;

                //    var loginResult =  new AbpLoginResult<Tenant,User>(
                //    tenant,
                //    user,
                //    principal.Identity as ClaimsIdentity
                //);

                if (!cacheItem.IsBackToImpersonator)
                {
                    //Add claims for audit logging
                    if (cacheItem.ImpersonatorTenantId.HasValue)
                    {
                        identity.AddClaim(new Claim(AbpClaimTypes.ImpersonatorTenantId, cacheItem.ImpersonatorTenantId.Value.ToString(CultureInfo.InvariantCulture)));
                    }

                    identity.AddClaim(new Claim(AbpClaimTypes.ImpersonatorUserId, cacheItem.ImpersonatorUserId.ToString(CultureInfo.InvariantCulture)));
                }

                //Sign in with the target user
                //AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
                //AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = false }, identity);
                await _signInManager.SignOutAndSignInAsync(identity, false);

                //Remove the cache item to prevent re-use
                await _cacheManager.GetImpersonationCache().RemoveAsync(tokenId);

                return RedirectToAction("Index", "Home");
            }
        }

#endregion

        #region Common

        private string GetTenancyNameOrNull(string tenantName="")
        {
            if (!string.IsNullOrEmpty(tenantName))
            {
                return tenantName;
            }
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }
            return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
        }

        private string NormalizeReturnUrl(string returnUrl, Func<string> defaultValueBuilder = null)
        {
            if (defaultValueBuilder == null)
            {
                defaultValueBuilder = GetAppHomeUrl;
            }

            if (returnUrl.IsNullOrEmpty())
            {
                return defaultValueBuilder();
            }

            if (Url.IsLocalUrl(returnUrl))
            {
                return returnUrl;
            }

            return defaultValueBuilder();
        }

        #endregion

        #region Etc

        /// <summary>
        /// This is a demo code to demonstrate sending notification to default tenant admin and host admin uers.
        /// Don't use this code in production !!!
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        /*
        public async Task<ActionResult> TestNotification(string message = "")
        {
            if (message.IsNullOrEmpty())
            {
                message = "This is a test notification, created at " + Clock.Now;
            }

            var defaultTenantAdmin = new UserIdentifier(1, 2);
            var hostAdmin = new UserIdentifier(null, 1);

            await _notificationPublisher.PublishAsync(
                    "App.SimpleMessage",
                    new MessageNotificationData(message),
                    severity: NotificationSeverity.Info,
                    userIds: new[] { defaultTenantAdmin, hostAdmin }
                 );

            return Content("Sent notification: " + message);
        }
        */
        #endregion
    }
}