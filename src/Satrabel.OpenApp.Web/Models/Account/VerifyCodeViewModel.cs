namespace Satrabel.OpenApp.Web.Models.Account
{
    public class VerifyCodeViewModel
    {
        public string Provider { get; set; }
        public string Code { get; set; }
        public bool RememberMe { get; set; }
        public bool RememberBrowser { get; set; }
    }
}