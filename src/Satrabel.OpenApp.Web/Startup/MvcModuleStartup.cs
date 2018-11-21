using System;
using System.Linq;
using Abp.Modules;
using Abp.Timing;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Swashbuckle.AspNetCore.Swagger;
using Abp.AspNetCore;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Identity;
using Abp.AspNetCore.SignalR.Hubs;
using Satrabel.OpenApp.SignalR;
using Satrabel.OpenApp.Authentication.JwtBearer;
using Satrabel.OpenApp.Web.Migration;
using Satrabel.OpenApp.Web.Resources;
using Satrabel.OpenApp.Web.Startup;
using Satrabel.OpenApp.Startup.Swashbuckle;

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

        public MvcModuleStartup(IHostingEnvironment env)
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
            services.AddMvc(options =>
            {
                options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                if (_corsEnabled)
                {
                    options.Filters.Add(new CorsAuthorizationFilterFactory(_defaultCorsPolicyName));
                }
            });

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);
            services.AddScoped<IWebResourceManager, WebResourceManager>();
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
                        .AllowCredentials()
                    );

                options.AddPolicy(
                    _allowAllCorsPolicyName,
                    builder => builder
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials()
                    );
            });

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            if (_swaggerEnabled)
            {
                services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new Info { Title = "OpenApp API", Version = "v1" });
                    options.DocInclusionPredicate((docName, description) => true);

                    /*
                     * Explanation of code below concerning CustomSchemaId
                     * 
                     * Swashbuckle for .Net Core generates simple DTO names by default. This is good and readable, but can become a problem when there are multiple DTO's with the same name in different Namespaces.
                     * 
                     * Thus, a more robust approach is to generate a FullName. This includes namespace, assembly version, etc, etc.
                     * Another problem is that when returning a DTO with generics. Like, for example, PagedResultDto<LanguageDto> a weird name is generated, including a backtick.
                     * This weird syntax
                     *  1. Is not very readable
                     *  2. Breaks code generation in later stages (for e.g. TypeScript)
                     *  
                     * We run into this issue when using CrudAppService. To fix this we apply a simple replace of the weird syntax characters to produce a Swagger definition that can be used for CodeGen.
                     * 
                     * A problem with the FullName is that it generates very long and unreadable names, since it includes version number of the assembly, etc, etc
                     * To get around this we provide an alternative where we only include Namespace, TypeName and generics. This approach seems to work for now, but might break in untested edge cases.
                     * 
                     * In any case FullName doesn't seem robust anyway whenever using generics, so it is hard to rely on FullName as a robust solution overall and it seems reasonable that our implementation is simply better.
                     * 
                     * A case in which the current implementation might break would be with more than 1 generic. This, however, is not the case with CrudAppService and thus should only be adjusted when there is a use case for multiple generics.
                     * This use case could very well be in a user's project. Whenever someone runs into this problem, a fix should be pushed to OpenApp.
                     */

                    //options.CustomSchemaIds(x => x.FullName); /* Using FullName */
                    //options.CustomSchemaIds(t => t.FullName.Replace("`1", "")); /* Using FullName with fix for Generics (only 1) */

                    options.CustomSchemaIds(type => CreateTypeNameWithNameSpace(type)); /* Custom naming implementation to support generics and multiple DTO's with the same name in different namespaces */

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

                    // By default ABP wraps API Responses with AjaxResponse. These don't get picked up automatically, so add them by enabling this OperationFilter.
                    // IMPORTANT: Should run after SecurityRequirementsOperationFilter. Otherwise the response type for alternative error codes will be incorrect.
                    options.OperationFilter<WrapAjaxResponseOperationFilter>();

                    // Make sure enums don't get inlined in the generated swagger definition, but are separately referenced (thus no duplicates)
                    options.SchemaFilter<NoDuplicatedEnumsOperationFilter>();
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

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            var applicationLifetime = app.ApplicationServices.GetRequiredService<IApplicationLifetime>();
            var migrationManager = app.ApplicationServices.GetRequiredService<IMigrationManager>();
            migrationManager.ApplicationLifetime = applicationLifetime;
            migrationManager.HostingEnvironment = env;
            migrationManager.AppVersion = AppVersion;

            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            if (_corsEnabled)
            {
                app.UseCors(_defaultCorsPolicyName); // Enable CORS!
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
            app.UseAbpRequestLocalization();

            if (_signalREnabled)
            {
                app.UseSignalR(routes =>
                {
                    routes.MapHub<AbpCommonHub>("/signalr");
                });
            }
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

        protected virtual void ConfigureBeforeStaticFiles(IApplicationBuilder app, IHostingEnvironment env)
        {

        }

        protected virtual void ConfigureAfterStaticFiles(IApplicationBuilder app, IHostingEnvironment env)
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
