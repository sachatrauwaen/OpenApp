using Abp.MultiTenancy;

namespace Satrabel.OpenApp.Web.Models.Account
{
    public class LoginFormViewModel
    {
        public string ReturnUrl { get; set; }

        public bool IsMultiTenancyEnabled { get; set; }

        public bool IsSelfRegistrationAllowed { get; set; }

        public bool IsTenancySelectionAllowed { get; set; }

        public MultiTenancySides MultiTenancySide { get; set; }
        public bool IsEmailConfirmationRequiredForLogin { get; set; }

        public string TenantLogo { get; set; }
        public string TenantDescription { get; set; }
    }
}