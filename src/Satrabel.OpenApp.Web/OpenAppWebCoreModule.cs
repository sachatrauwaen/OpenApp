using System;
using System.Reflection;
using System.Text;
using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.Configuration;
using Satrabel.OpenApp.Authentication.JwtBearer;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.EntityFramework;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Satrabel.OpenApp.ProxyScripting;
using Abp.Configuration.Startup;
using Abp.Resources.Embedded;
using Satrabel.OpenApp.Web.Startup;
using Satrabel.OpenApp.Startup;
using Abp.Dependency;

#if FEATURE_SIGNALR
using Abp.Web.SignalR;
#endif

namespace Satrabel.OpenApp
{
    [DependsOn(
         typeof(OpenAppApplicationModule),
         typeof(OpenAppEntityFrameworkModule),
         typeof(AbpAspNetCoreModule)
#if FEATURE_SIGNALR 
        ,typeof(AbpWebSignalRModule)
#endif
     )]
    public class OpenAppWebCoreModule : AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public OpenAppWebCoreModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                OpenAppConsts.ConnectionStringName
            );

            //Use database for language management
            //Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization(); // to be done in top level module
            Configuration.Modules.AbpAspNetCore()
                 .CreateControllersForAppServices(
                     typeof(OpenAppApplicationModule).GetAssembly()
                 );
            Configuration.Modules.AbpWebCommon().ApiProxyScripting.Generators[JsonSchemaProxyScriptGenerator.Name] = typeof(JsonSchemaProxyScriptGenerator);
            ConfigureTokenAuth();
            Configuration.EmbeddedResources.Sources.Add(
                new EmbeddedResourceSet(
                    "/Views/",
                    Assembly.GetExecutingAssembly(),
                    "Satrabel.OpenApp.Views"
                )
            );
            Configuration.Navigation.Providers.Add<OpenAppNavigationProvider>();
        }

        private void ConfigureTokenAuth()
        {
            IocManager.Register<TokenAuthConfiguration>();
            var tokenAuthConfig = IocManager.Resolve<TokenAuthConfiguration>();

            tokenAuthConfig.SecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appConfiguration["Authentication:JwtBearer:SecurityKey"]));
            tokenAuthConfig.Issuer = _appConfiguration["Authentication:JwtBearer:Issuer"];
            tokenAuthConfig.Audience = _appConfiguration["Authentication:JwtBearer:Audience"];
            tokenAuthConfig.SigningCredentials = new SigningCredentials(tokenAuthConfig.SecurityKey, SecurityAlgorithms.HmacSha256);
            tokenAuthConfig.Expiration = TimeSpan.FromDays(1);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OpenAppWebCoreModule).GetAssembly());
        }
    }
}
