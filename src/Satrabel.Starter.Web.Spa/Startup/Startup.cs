using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Satrabel.OpenApp.Startup;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<WebMvcModule>
    {
        public Startup(IWebHostEnvironment env) : base(env)
        {
            AppVersion = AppConsts.AppVersion;
        }

        protected override void AddAdditionalServices(IServiceCollection services)
        {
            //if (bool.Parse(_appConfiguration["Authentication:Google:IsEnabled"]))
            //{
            //    services.AddAuthentication().AddGoogle(googleOptions =>
            //    {
            //        googleOptions.ClientId = _appConfiguration["Authentication:Google:ClientId"];
            //        googleOptions.ClientSecret = _appConfiguration["Authentication:Google:ClientSecret"];
            //        googleOptions.Scope.Add(Google.Apis.Drive.v3.DriveService.Scope.Drive);
            //        googleOptions.AccessType = "offline";                    

            //    });
            //}
        }

        protected override void ConfigureBeforeStaticFiles(IApplicationBuilder app, IWebHostEnvironment env)
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
