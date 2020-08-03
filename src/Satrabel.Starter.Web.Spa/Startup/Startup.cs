using System;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Startup;
using Satrabel.Starter.Web.Authorization;

namespace Satrabel.Starter.Web.Startup
{
    public class Startup : MvcModuleStartup<WebMvcModule>
    {
        private readonly bool _hangfireEnabled = false;

        public Startup(IWebHostEnvironment env) : base(env)
        {
            AppVersion = AppConsts.AppVersion;
            var configuration = env.GetAppConfiguration();
            Boolean.TryParse(configuration["Hangfire:IsEnabled"] ?? "", out _hangfireEnabled);
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

            if (_hangfireEnabled)
            {
                services.AddHangfire(config =>
                {
                    config.UseSqlServerStorage(_appConfiguration.GetConnectionString("Default"));
                });
            }
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

        protected override void ConfigureAfterStaticFiles(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (_hangfireEnabled)
            {
                //Example Configuration
                app.UseHangfireServer(new BackgroundJobServerOptions { WorkerCount = 5 });

                app.UseHangfireDashboard("/backgroundjobs", new DashboardOptions
                {
                    DashboardTitle = $"OpenApp Background jobs",
                    Authorization = new[] { new OpenAppHangfireAuthorizationFilter(PermissionNames.Pages_Admin) }
                });
            }
        }
    }
}
