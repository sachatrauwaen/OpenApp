using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
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
            var options = new RewriteOptions().Add(new PageRule());
            app.UseRewriter(options);
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
