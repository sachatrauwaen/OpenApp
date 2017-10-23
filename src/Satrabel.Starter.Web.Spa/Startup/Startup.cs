
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Satrabel.OpenApp.Startup;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<WebMvcModule>
    {
        public Startup(IHostingEnvironment env) : base(env)
        {
            AppVersion = AppConsts.AppVersion;
        }

        protected override void ConfigureBeforeStaticFiles(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
        }
    }
}
