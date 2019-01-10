using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Satrabel.Starter.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : StarterControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}