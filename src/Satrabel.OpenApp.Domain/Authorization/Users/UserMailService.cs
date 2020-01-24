using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Authorization.Users;
using Abp.Domain.Services;
using Abp.IdentityFramework;
using Abp.Runtime.Session;
using Abp.UI;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.MultiTenancy;
using Abp.Net.Mail;
using Microsoft.AspNetCore.Http.Extensions;
using Abp.Configuration;
using Satrabel.OpenApp.Configuration;

namespace Satrabel.OpenApp.Authorization.Users
{
    public class UserMailService : DomainService
    {
        public IAbpSession AbpSession { get; set; }

        private readonly TenantManager _tenantManager;
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IEmailSender _emailSender;
        private readonly ISettingDefinitionManager _settingDefinitionManager;

        public UserMailService(
            TenantManager tenantManager,
            UserManager userManager,
            RoleManager roleManager,
            IPasswordHasher<User> passwordHasher,
            IEmailSender emailSender,
            ISettingDefinitionManager settingDefinitionManager)
        {
            _tenantManager = tenantManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
            _emailSender = emailSender;
            _settingDefinitionManager = settingDefinitionManager;

            AbpSession = NullAbpSession.Instance;
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }

        public Task SendConfirmationMail(User user)
        {
            if (user.IsEmailConfirmed)
                throw new ApplicationException("User email is already confirmed.");

            if (string.IsNullOrEmpty(user.EmailConfirmationCode))
                throw new ApplicationException("User has no email confirmation code.");

            var baseUrl = SettingManager.GetSettingValue(AppSettingNames.ClientRootAddress);
            var confirmationLink = $"{baseUrl}/Account/Confirm?userId={user.Id}&tenantId={user.TenantId}&code={user.EmailConfirmationCode}";

            // TODO Translate title
            // TODO Allow template to be provided by client app (through setting or configuration) as lambda, providing confirmationLink and user and expecting string as a result

            return _emailSender.SendAsync(
                to: user.EmailAddress,
                subject: "Registration",
                body: $"Hello, {user.FullName}, You have been successfully registered. Follow this link: {confirmationLink}",
                isBodyHtml: true
            );
        }

        public async Task SendRegistrationMailAsync(User user, string password)
        {
            if (user.TenantId.HasValue)
            {
                var baseUrl = SettingManager.GetSettingValue(AppSettingNames.ClientRootAddress);
                var tenant = await _tenantManager.GetByIdAsync(user.TenantId.Value);
                // TODO Translate title
                // TODO Allow template to be provided by client app (through setting or configuration) as lambda, providing confirmationLink and user and expecting string as a result

                await _emailSender.SendAsync(
                    to: user.EmailAddress,
                     subject: string.Format(L("UserRegistrationSubject"), tenant.Name),
                    body: string.Format(L("UserRegistrationBody"), user.FullName, tenant.Name, baseUrl, user.Name,password),
                    isBodyHtml: true
                );
            }
        }

        public async Task SendAdminRegistrationMailAsync(User user, string password)
        {
            if (user.TenantId.HasValue)
            {
                var baseUrl = SettingManager.GetSettingValue(AppSettingNames.ClientRootAddress);
                var tenant = await _tenantManager.GetByIdAsync(user.TenantId.Value);
                // TODO Translate title
                // TODO Allow template to be provided by client app (through setting or configuration) as lambda, providing confirmationLink and user and expecting string as a result

                await _emailSender.SendAsync(
                    to: user.EmailAddress,
                    subject: string.Format(L("TenantRegistrationSubject"),tenant.Name),
                    body: string.Format(L("TenantRegistrationBody"), user.FullName, tenant.Name, baseUrl, user.Name, password),
                    isBodyHtml: true
                );
            }
        }

    }
}
