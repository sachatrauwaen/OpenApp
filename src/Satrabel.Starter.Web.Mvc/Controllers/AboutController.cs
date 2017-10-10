using Abp.AspNetCore.Mvc.Authorization;
using Satrabel.OpenApp.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace Satrabel.Starter.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : StarterControllerBase
    {
        private readonly Abp.Dependency.IIocResolver _iocResolver;
        private readonly IFileProvider _fileProvider;
        public AboutController(Abp.Dependency.IIocResolver iocResolver)
        {
            _iocResolver = iocResolver;
            _fileProvider = new Abp.AspNetCore.EmbeddedResources.EmbeddedResourceFileProvider(
                        _iocResolver
                    );

        }
        public ActionResult Index()
        {
            var contents = _fileProvider.GetDirectoryContents("");
            return View(contents);
        }
	}
}