using Satrabel.OpenApp.Controllers;
using Microsoft.AspNetCore.Antiforgery;

namespace Satrabel.OpenApp.Web.Host.Controllers
{
    public class AntiForgeryController : OpenAppControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}