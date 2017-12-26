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
using Abp.Timing;
using Abp.Modules;

using Satrabel.OpenApp.Web.Resources;
using Satrabel.OpenApp.Web.Startup;
using Microsoft.AspNetCore.Http;
using Satrabel.OpenApp.Web.Migration;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Swashbuckle.AspNetCore.Swagger;
using System.Linq;
using Abp.Extensions;

#if FEATURE_SIGNALR
using Owin;
using Abp.Owin;
using Satrabel.OpenApp.Owin;
#endif

namespace Satrabel.OpenApp.Startup
{
    public class MvcModuleStartup<TModule> where TModule : AbpModule
    {
        private const string DefaultCorsPolicyName = "DefaultPolicy";
        private readonly IConfigurationRoot _appConfiguration;
        private readonly bool _corsEnabled = false;
        private readonly bool _swaggerEnabled = false;
        protected Version AppVersion;

        public MvcModuleStartup(IHostingEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
            _corsEnabled = bool.Parse(_appConfiguration["Cors:IsEnabled"]);
            _swaggerEnabled = bool.Parse(_appConfiguration["Swagger:IsEnabled"]);
            Clock.Provider = ClockProviders.Local;
        }

        public virtual IServiceProvider ConfigureServices(IServiceCollection services)
        {
            //MVC
            services.AddMvc(options =>
            {
                options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                if (_corsEnabled)
                {
                    options.Filters.Add(new CorsAuthorizationFilterFactory(DefaultCorsPolicyName));
                }
            });
            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);
            services.AddScoped<IWebResourceManager, WebResourceManager>();
            services.AddSingleton<IMigrationManager>(new MigrationManager());
            services.AddSingleton<IWebConfig>(new WebConfig());

            // Configure CORS for angular2 UI or other clients. This does not activate Cors. It only configures it.
            services.AddCors(options =>
            {
                options.AddPolicy(DefaultCorsPolicyName, builder =>
                {
                        //App:CorsOrigins in appsettings.json can contain more than one address with splitted by comma.
                        builder
                        .WithOrigins(_appConfiguration["App:CorsOrigins"].Split(",", StringSplitOptions.RemoveEmptyEntries).Select(o => o.Trim().RemovePostFix("/")).ToArray())
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            //Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            if (_swaggerEnabled)
            {
                services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new Info { Title = "OpenApp API", Version = "v1" });
                    options.DocInclusionPredicate((docName, description) => true);
                    options.CustomSchemaIds(x => x.FullName);
                    // Define the BearerAuth scheme that's in use
                    options.AddSecurityDefinition("bearerAuth", new ApiKeyScheme()
                    {
                        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                        Name = "Authorization",
                        In = "header",
                        Type = "apiKey"
                    });
                    // Assign scope requirements to operations based on AuthorizeAttribute
                    options.OperationFilter<SecurityRequirementsOperationFilter>();
                });
            }
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
            var applicationLifetime = app.ApplicationServices.GetRequiredService<IApplicationLifetime>();
            var migrationManager = app.ApplicationServices.GetRequiredService<IMigrationManager>();
            migrationManager.ApplicationLifetime = applicationLifetime;
            migrationManager.HostingEnvironment = env;
            migrationManager.AppVersion = AppVersion;
            app.UseAbp(); //Initializes ABP framework.

            if (_corsEnabled)
            {
                app.UseCors(DefaultCorsPolicyName);
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            if (migrationManager.NeedMigration)
            {
                app.Run(async (context) =>
                {
                    {
                        await context.Response.WriteAsync("Database Migrated to version " + migrationManager.AppVersion + ". Refresh page to start website.");
                    }
                    applicationLifetime.StopApplication();
                });
                return;
            }

            ConfigureBeforeStaticFiles(app, env);
            app.UseStaticFiles();
            // start temp fix
            //app.UseEmbeddedFiles(); 
            app.UseStaticFiles(
                new StaticFileOptions
                {
                    FileProvider = new Web.EmbeddedResources.EmbeddedResourceFileProvider(
                        app.ApplicationServices.GetRequiredService<Abp.Dependency.IIocResolver>()
                    )
                }
            );
            // end temp fix
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

                routes.MapRoute(
                    name: "clientApp",
                    template: "App/{id}",
                    defaults: new { controller = "ClientApp", action = "Run" });

            });
            if (_swaggerEnabled)
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint
                app.UseSwagger();
                // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
                app.UseSwaggerUI(options =>
                {
                    options.InjectOnCompleteJavaScript("/Views/swagger/ui/abp.js");
                    options.InjectOnCompleteJavaScript("/Views/swagger/ui/oncomplete.js");
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "OpenApp API V1");
                }); //URL: /swagger
            }
        }

        protected virtual void ConfigureBeforeStaticFiles(IApplicationBuilder app, IHostingEnvironment env)
        {

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
