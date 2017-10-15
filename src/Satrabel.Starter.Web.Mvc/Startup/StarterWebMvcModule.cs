using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;
using Satrabel.Starter.Web.Authorization;
using Abp.EntityFrameworkCore.Configuration;
using Satrabel.Starter.EntityFrameworkCore;
using Satrabel.Starter.Web.Localization;

namespace Satrabel.Starter.Web.Startup
{
    [DependsOn(typeof(OpenAppWebCoreModule))]
    public class StarterWebMvcModule : AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }
        public bool SkipDbSeed { get; set; }

        public StarterWebMvcModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<StarterDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        StarterDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        StarterDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }
            StarterLocalizationConfigurer.Configure(Configuration.Localization);
            //Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = StarterConsts.MultiTenancyEnabled;


            Configuration.Authorization.Providers.Add<StarterAuthorizationProvider>();
            Configuration.Navigation.Providers.Add<StarterNavigationProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StarterWebMvcModule).GetAssembly());
        }
    }
}