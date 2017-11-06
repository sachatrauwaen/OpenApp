
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Satrabel.OpenApp.Startup;
using System.Collections.Generic;

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
            //if (env.IsDevelopment())
            //{
            //    app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
            //    {
            //        HotModuleReplacement = true,
            //        //HotModuleReplacementClientOptions = new Dictionary<string, string> {
            //        //    { "reload", "true" },
            //        //    { "timeout","20000" }
            //        //},

            //    });
            //}
        }
    }
}
