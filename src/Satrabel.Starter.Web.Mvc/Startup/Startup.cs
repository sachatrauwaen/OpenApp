
using Microsoft.AspNetCore.Hosting;
using Satrabel.OpenApp.Startup;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<WebMvcModule>
    {
        public Startup(IWebHostEnvironment env) : base(env)
        {
            AppVersion = AppConsts.AppVersion;
        }
    }
}
