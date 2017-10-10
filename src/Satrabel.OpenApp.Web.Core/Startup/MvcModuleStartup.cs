using System;
using Abp.AspNetCore;
using Abp.Castle.Logging.Log4Net;
using Satrabel.OpenApp.Authentication.JwtBearer;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Identity;

using Castle.Facilities.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Abp.Timing;
using Abp.Modules;

using Satrabel.OpenApp.Web.Resources;
using Satrabel.OpenApp.Web.Startup;
using Abp.Resources.Embedded;
using Microsoft.Extensions.FileProviders;
using Abp.Web.Configuration;
using System.Data.SqlClient;

#if FEATURE_SIGNALR
using Owin;
using Abp.Owin;
using Satrabel.OpenApp.Owin;
#endif

namespace Satrabel.OpenApp.Startup
{
    public class MvcModuleStartup<TModule> where TModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public MvcModuleStartup(IHostingEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
            Clock.Provider = ClockProviders.Local;
        }

        public virtual IServiceProvider ConfigureServices(IServiceCollection services)
        {
            //MVC
            services.AddMvc(options =>
            {
                options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
            });

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);

            services.AddScoped<IWebResourceManager, WebResourceManager>();

            //Configure Abp and Dependency Injection
            return services.AddAbp<TModule>(options =>
            {
                //Configure Log4Net logging
                options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig("log4net.config")
                );
            });
        }

        public virtual void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            try
            {
                app.UseAbp(); //Initializes ABP framework.
            }
            catch (SqlException ex)
            {
                if (ex.Number == 208 && ex.Message.Contains("AppEditions"))
                {

                }

                throw;
            }
            

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseEmbeddedFiles();

            app.UseAuthentication();
            app.UseJwtTokenMiddleware();

#if FEATURE_SIGNALR
            //Integrate to OWIN
            app.UseAppBuilder(ConfigureOwinServices);
#endif

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "defaultWithArea",
                    template: "{area}/{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

#if FEATURE_SIGNALR
        private static void ConfigureOwinServices(IAppBuilder app)
        {
            app.Properties["host.AppName"] = "OpenApp";

            app.UseAbp();

            app.MapSignalR();
        }
#endif
    }
}
