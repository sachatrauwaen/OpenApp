using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Satrabel.OpenApp.Startup;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<WebMvcModule>
    {
        public Startup(IHostingEnvironment env) : base(env)
        {
            AppVersion = AppConsts.AppVersion;
        }

        protected override void AddAdditionalServices(IServiceCollection services)
        {
           
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
