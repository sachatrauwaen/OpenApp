namespace Satrabel.OpenApp.Web.Models.Account
{
    public class VerifyTwoFactorViewModel
    {
        public string Provider { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }
}