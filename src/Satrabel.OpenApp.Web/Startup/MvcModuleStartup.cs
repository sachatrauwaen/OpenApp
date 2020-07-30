using System;
using System.Linq;
using Abp.Modules;
using Abp.Timing;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Abp.AspNetCore;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Identity;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Json;
using Newtonsoft.Json.Serialization;
using Satrabel.OpenApp.SignalR;
using Satrabel.OpenApp.Authentication.JwtBearer;
using Satrabel.OpenApp.Web.Migration;
using Satrabel.OpenApp.Web.Resources;
using Satrabel.OpenApp.Web.Startup;
using Microsoft.Extensions.Hosting;
using Abp.AspNetCore.Mvc.Antiforgery;
using Microsoft.OpenApi.Models;
using Satrabel.OpenApp.Render;

namespace Satrabel.OpenApp.Startup
{
    public class MvcModuleStartup<TModule> where TModule : AbpModule
    {
        private const string _defaultCorsPolicyName = "DefaultPolicy";
        private const string _allowAllCorsPolicyName = "AllowAllPolicy";
        protected readonly IConfigurationRoot _appConfiguration;
        private readonly bool _corsEnabled = false;
        private readonly bool _swaggerEnabled = false;
        private readonly bool _signalREnabled = false;

        protected Version AppVersion;

        public MvcModuleStartup(IWebHostEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
            _corsEnabled = bool.Parse(_appConfiguration["Cors:IsEnabled"] ?? "false");
            _swaggerEnabled = bool.Parse(_appConfiguration["Swagger:IsEnabled"] ?? "false");
            _signalREnabled = bool.Parse(_appConfiguration["SignalR:IsEnabled"] ?? "false");

            SignalRFeature.IsAvailable = _signalREnabled;
            Clock.Provider = ClockProviders.Local;
        }

        #region Helpers for Swagger name generation
        private string CreateGenericTypeName(Type[] generics)
        {
            return generics.Count() > 0 ? "[" + String.Join("_", generics.Select(type => CreateTypeNameWithNameSpace(type))) + "]" : "";
        }

        private string CreateTypeNameWithNameSpace(Type type)
        {
            return type.Namespace + "." + RemoveGenericsBackticks(type.Name) + CreateGenericTypeName(type.GenericTypeArguments);
        }

        private string RemoveGenericsBackticks(string name) => name
            .Replace("`1", "")
            .Replace("`2", "")
            .Replace("`3", "")
            .Replace("`4", "")
            .Replace("`5", "")
            .Replace("`6", "")
            .Replace("`8", "")
            .Replace("`9", "");
        #endregion

        public virtual IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // MVC
            //services.AddMvc(options =>
            //{
            //    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
            //    if (_corsEnabled)
            //    {
            //        //does not exist anymore in dotnet3 :  options.Filters.Add(new CorsAuthorizationFilterFactory(_defaultCorsPolicyName));
            //    }
            //});

            services.Configure<Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation.MvcRazorRuntimeCompilationOptions>(options =>
            {
                //options.FileProviders.Clear();
                options.FileProviders.Add(new Web.EmbeddedResources.EmbeddedResourceFileProvider(
                    IocManager.Instance
                ));
            });

            // MVC
            services.AddControllersWithViews(
                options =>
                {
                    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                    options.Filters.Add(new AbpAutoValidateAntiforgeryTokenAttribute());

                }
            ).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new AbpMvcContractResolver(IocManager.Instance)
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };
            });
            services.AddRazorPages().AddRazorRuntimeCompilation();

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);
            services.AddScoped<IWebResourceManager, WebResourceManager>();
            services.AddScoped<IViewRenderService, ViewRenderService>();
            services.AddSingleton<IMigrationManager>(new MigrationManager());
            services.AddSingleton<IWebConfig>(new WebConfig());

            if (_signalREnabled)
            {
                services.AddSignalR();
            }

            // Configure CORS for angular2 UI or other clients. This does not activate Cors. It only configures it.
            services.AddCors(options =>
            {
                options.AddPolicy(
                    _defaultCorsPolicyName,
                    builder => builder
                        .WithOrigins(
                            // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                            _appConfiguration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.Trim().RemovePostFix("/"))
                                .ToArray()
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                    );

                options.AddPolicy(
                    _allowAllCorsPolicyName,
                    builder => builder
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                    );
            });

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            if (_swaggerEnabled)
            {
                services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo() { Title = "AspBoilerPlate31 API", Version = "v1" });
                    options.DocInclusionPredicate((docName, description) => true);

                    // Define the BearerAuth scheme that's in use
                    options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme()
                    {
                        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey
                    });
                });
            }

            AddAdditionalServices(services);

            // Configure Abp and Dependency Injection
            return services.AddAbp<TModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig("log4net.config")
                )
            );
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            var applicationLifetime = app.ApplicationServices.GetRequiredService<IHostApplicationLifetime>();
            var migrationManager = app.ApplicationServices.GetRequiredService<IMigrationManager>();
            migrationManager.ApplicationLifetime = applicationLifetime;
            migrationManager.HostingEnvironment = env;
            migrationManager.AppVersion = AppVersion;

            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            if (_corsEnabled)
            {
                app.UseCors(_defaultCorsPolicyName); // Enable a defaultCorsPolicy on every controller !
            }

            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //}

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

            app.UseRouting();
            app.UseAuthentication();

            app.UseAuthorization(); // ??? is this necessary? yes, without it, the site just doesn't work

            app.UseJwtTokenMiddleware();
            app.UseAbpRequestLocalization();

            //if (_signalREnabled)
            //{
            //    app.UseSignalR(routes =>
            //    {
            //        routes.MapHub<AbpCommonHub>("/signalr");
            //    });
            //}
            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute(
            //        name: "defaultWithArea",
            //        template: "{area}/{controller=Home}/{action=Index}/{id?}");
            //    routes.MapRoute(
            //        name: "default",
            //        template: "{controller=Home}/{action=Index}/{id?}");
            //    routes.MapRoute(
            //        name: "clientApp",
            //        template: "App/{id}",
            //        defaults: new { controller = "ClientApp", action = "Run" });
            //});
            app.UseEndpoints(endpoints =>
            {
                if (_signalREnabled)
                {
                    endpoints.MapHub<AbpCommonHub>("/signalr");
                }
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("defaultWithArea", "{area}/{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("clientApp", "App/{id}", defaults: new { controller = "ClientApp", action = "Run" });
            });

            if (_swaggerEnabled)
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint
                app.UseSwagger();
                // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "OpenApp API V1");
                    //options.IndexStream = () => Assembly.GetExecutingAssembly()
                    //    .GetManifestResourceStream("Satrabel.OpenApp.Web.Views.swagger.ui.index.html");
                }); //URL: /swagger
            }

            // Should be called last
            ConfigureAfterStaticFiles(app, env);
        }

        /// <summary>
        /// Override this method to add additional services
        /// </summary>
        /// <param name="services"></param>
        protected virtual void AddAdditionalServices(IServiceCollection services)
        {

        }

        protected virtual void ConfigureBeforeStaticFiles(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }

        protected virtual void ConfigureAfterStaticFiles(IApplicationBuilder app, IWebHostEnvironment env)
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
