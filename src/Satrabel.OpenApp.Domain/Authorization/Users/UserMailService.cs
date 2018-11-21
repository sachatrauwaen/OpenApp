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

        public UserMailService(
            TenantManager tenantManager,
            UserManager userManager,
            RoleManager roleManager,
            IPasswordHasher<User> passwordHasher,
            IEmailSender emailSender)
        {
            _tenantManager = tenantManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
            _emailSender = emailSender;

            AbpSession = NullAbpSession.Instance;
        }

        public Task SendRegistrationMail(User user)
        {
            if (user.IsEmailConfirmed)
                throw new ApplicationException("User email is already confirmed.");

            if (string.IsNullOrEmpty(user.EmailConfirmationCode))
                throw new ApplicationException("User has no email confirmation code.");

            return _emailSender.SendAsync(
                to: user.EmailAddress,
                subject: "Registration",
                body: $"You have been successfully registered. Your confirmation code is: {user.EmailConfirmationCode}",
                isBodyHtml: true
            );
        }
    }
}
