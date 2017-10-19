
using Microsoft.AspNetCore.Hosting;
using Satrabel.OpenApp.Startup;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<StarterWebMvcModule>
    {
        public Startup(IHostingEnvironment env) : base(env)
        {
            AppVersion = StarterConsts.AppVersion;
        }
    }
}
