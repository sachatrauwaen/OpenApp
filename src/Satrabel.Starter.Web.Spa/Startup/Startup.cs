using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Satrabel.OpenApp.Startup;
using Satrabel.Starter.Web.Signalr;

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
            app.UseSignalR(routes =>
            {
                //routes.MapHub<AbpCommonHub>("/signalr");
                routes.MapHub<MyChatHub>("/signalr-myChatHub"); // Prefix with '/signalr'
            });
            

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
