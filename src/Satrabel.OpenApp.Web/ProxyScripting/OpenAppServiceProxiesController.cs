using Abp.AspNetCore.Mvc.Controllers;
using Abp.Auditing;
using Abp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Satrabel.OpenApp.ProxyScripting;

namespace Satrabel.OpenApp.ProxyScripting
{
   [DontWrapResult]
   [DisableAuditing]
    public class OpenAppServiceProxiesController : AbpController
    {
        private readonly IApiProxyScriptManager _proxyScriptManager;

        public OpenAppServiceProxiesController(IApiProxyScriptManager proxyScriptManager)
        {
            _proxyScriptManager = proxyScriptManager;
        }

        //[Produces( "text/javascript", "text/plain")]
        public ActionResult GetAll(Abp.AspNetCore.Mvc.Proxying.ApiProxyGenerationModel model)
        {
            return Content( _proxyScriptManager.GetScript(model.CreateOptions()), "text/javascript");
        }
    }
}
