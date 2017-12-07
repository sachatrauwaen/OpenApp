using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using Satrabel.OpenApp.Controllers;

namespace Satrabel.OpenApp.Web.Controllers
{
    [AbpMvcAuthorize]
    public class LocalizationController : OpenAppControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}