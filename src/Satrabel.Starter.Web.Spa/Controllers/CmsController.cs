using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Authorization;
using Satrabel.Starter.Web.Application;
using Satrabel.Starter.Web.Controllers;
using Satrabel.Starter.Web.Application.Cms;

namespace Satrabel.Starter.Web.Spa.Controllers
{
    public class CmsController : StarterControllerBase
    {
        private CmsAppService _cmsAppService = new CmsAppService();

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Gets the page with the given id.
        /// </summary>
        /// <param name="id">The unique page id</param>
        [Route("page")]
        [AbpAllowAnonymous]
        public IActionResult Page(int id)
        {
            var model = _cmsAppService.GetPage(id);
            ViewBag.CurrentPage = model.Id;

            return View(model);
        }
    }
}