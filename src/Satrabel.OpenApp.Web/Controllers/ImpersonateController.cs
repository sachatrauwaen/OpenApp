using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Abp.UI;
using Satrabel.OpenApp.Authentication.External;
using Satrabel.OpenApp.Authentication.JwtBearer;
using Satrabel.OpenApp.Authorization;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.Models.TokenAuth;
using Satrabel.OpenApp.MultiTenancy;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Uow;
using Satrabel.OpenApp.Controllers;
using Satrabel.OpenApp.Web.Models.Impersonate;
using Satrabel.OpenApp.Identity;
using Abp.Runtime.Caching;
using Abp.Application.Services;

namespace Satrabel.OpenApp.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [RemoteService(isEnabled:true)]
    public class ImpersonateController : OpenAppControllerBase
    {
        private readonly LogInManager _logInManager;
        private readonly ITenantCache _tenantCache;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly TokenAuthConfiguration _configuration;
        private readonly IExternalAuthConfiguration _externalAuthConfiguration;
        private readonly IExternalAuthManager _externalAuthManager;
        private readonly UserRegistrationManager _userRegistrationManager;

        private readonly TenantManager _tenantManager;
        private readonly UserManager _userManager;
        private readonly SignInManager _signInManager;
        private readonly ICacheManager _cacheManager;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ImpersonateController(
            LogInManager logInManager,
            ITenantCache tenantCache,
            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            TokenAuthConfiguration configuration,
            IExternalAuthConfiguration externalAuthConfiguration,
            IExternalAuthManager externalAuthManager,
            UserRegistrationManager userRegistrationManager,
            TenantManager tenantManager,
            UserManager userManager,
            SignInManager signInManager,
            ICacheManager cacheManager,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _logInManager = logInManager;
            _tenantCache = tenantCache;
            _userManager = userManager;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _configuration = configuration;
            _externalAuthConfiguration = externalAuthConfiguration;
            _externalAuthManager = externalAuthManager;
            _userRegistrationManager = userRegistrationManager;
            _tenantManager = tenantManager;
            _signInManager = signInManager;
            _cacheManager = cacheManager;
            _unitOfWorkManager = unitOfWorkManager;
        }

        /*  SAMPLE AJAX CALL to this action:
            (This is enough since it's automatically redirected to the target tenant's ImpersonateSignIn action)
            abp.ajax({
                url: abp.appPath + 'Account/Impersonate', 
                data: JSON.stringify({
                    tenantId: 1, //Target tenant id (can be null if target user is a host user)
                    userId: 2 //Target user id
                })
            });
         */
        [HttpPost]
        [AbpMvcAuthorize(PermissionNames.Pages_Users)]
        public virtual async Task<string> Impersonate(ImpersonateModel model)
        {
            //CheckModelState();

            if (AbpSession.ImpersonatorUserId.HasValue)
            {
                throw new UserFriendlyException(L("CascadeImpersonationErrorMessage"));
            }

            if (AbpSession.TenantId.HasValue)
            {
                if (!model.TenantId.HasValue)
                {
                    //model.TenantId = AbpSession.TenantId;
                    throw new UserFriendlyException(L("FromTenantToHostImpersonationErrorMessage"));
                }

                if (model.TenantId.Value != AbpSession.TenantId.Value)
                {
                    throw new UserFriendlyException(L("DifferentTenantImpersonationErrorMessage"));
                }
            }

            return await SaveImpersonationTokenAndGetTargetUrl(model.TenantId, model.UserId, false);
        }

        [HttpPost]
        [AbpMvcAuthorize(PermissionNames.Pages_Tenants)]
        public virtual async Task<string> ImpersonateTenant(int tenantId)
        {
            //CheckModelState();
            long userId = 0;
            if (AbpSession.ImpersonatorUserId.HasValue)
            {
                throw new UserFriendlyException(L("CascadeImpersonationErrorMessage"));
            }

            if (AbpSession.TenantId.HasValue)
            {
                throw new UserFriendlyException(L("FromTenantToHostImpersonationErrorMessage"));
            }
            using (CurrentUnitOfWork.SetTenantId(tenantId))
            {
                var user = await _userManager.FindByNameAsync("admin");
                if (user == null)
                {
                    throw new UserFriendlyException(L("NoAdminUserImpersonationErrorMessage"));
                }
                userId = user.Id;
            }
            return await SaveImpersonationTokenAndGetTargetUrl(tenantId, userId, false);
        }


        /*  SAMPLE AJAX CALL to this action:
            (This is enough since it's automatically redirected to the host's ImpersonateSignIn action)
            abp.ajax({
                url: abp.appPath + 'Account/BackToImpersonator'                
            });
            */
        [HttpPost]
        public virtual async Task<string> BackToImpersonator()
        {
            if (!AbpSession.ImpersonatorUserId.HasValue)
            {
                throw new UserFriendlyException(L("NotImpersonatedLoginErrorMessage"));
            }

            return await SaveImpersonationTokenAndGetTargetUrl(AbpSession.ImpersonatorTenantId, AbpSession.ImpersonatorUserId.Value, true);
        }

        private async Task<string> SaveImpersonationTokenAndGetTargetUrl(int? tenantId, long userId, bool isBackToImpersonator)
        {
            //Create a cache item
            var cacheItem = new ImpersonationCacheItem(
                tenantId,
                userId,
                isBackToImpersonator
                );

            if (!isBackToImpersonator)
            {
                cacheItem.ImpersonatorTenantId = AbpSession.TenantId;
                cacheItem.ImpersonatorUserId = AbpSession.UserId.Value;
            }

            //Create a random token and save to the cache
            var tokenId = Guid.NewGuid().ToString();
            await _cacheManager
                .GetImpersonationCache()
                .SetAsync(tokenId, cacheItem, TimeSpan.FromMinutes(1));

            //Find tenancy name
            string tenancyName = null;
            if (tenantId.HasValue)
            {
                tenancyName = (await _tenantManager.GetByIdAsync(tenantId.Value)).TenancyName;
            }

            //Create target URL
            var targetUrl = /*_webUrlService.GetSiteRootAddress(tenancyName) */ "/Account/ImpersonateSignIn?tokenId=" + tokenId;
            return targetUrl;
        }



    }
}
