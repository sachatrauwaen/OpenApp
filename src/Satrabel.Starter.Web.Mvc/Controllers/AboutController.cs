using Abp.AspNetCore.Mvc.Authorization;
using Satrabel.OpenApp.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace Satrabel.Starter.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : StarterControllerBase
    {
        public AboutController()
        {
        }

        public ActionResult Index()
        {
            return View();
        }
	}
}