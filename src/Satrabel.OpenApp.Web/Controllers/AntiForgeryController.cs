using Microsoft.AspNetCore.Antiforgery;
using Satrabel.OpenApp.Controllers;

namespace Satrabel.OpenApp.Web.Controllers
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