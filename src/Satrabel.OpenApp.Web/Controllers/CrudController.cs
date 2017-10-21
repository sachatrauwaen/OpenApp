using Abp.AspNetCore.Mvc.Authorization;
using Satrabel.OpenApp.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Satrabel.OpenApp.Web.Controllers
{
    [AbpMvcAuthorize]
    public class CrudController : OpenAppControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}