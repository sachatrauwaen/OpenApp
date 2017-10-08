using Abp.AspNetCore.Mvc.Authorization;
using Satrabel.OpenApp.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Satrabel.Starter.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : OpenAppControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}