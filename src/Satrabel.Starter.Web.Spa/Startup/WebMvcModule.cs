using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;
using Abp.EntityFrameworkCore.Configuration;
using Satrabel.Starter.Web.Localization;
using Satrabel.OpenApp.EntityFramework.Seed;
using Satrabel.OpenApp.Configuration;
using Satrabel.Starter.Web.Authorization;
using Satrabel.Starter.EntityFramework;
using Satrabel.OpenApp.Web.Migration;
using Abp.AspNetCore.Configuration;
using Satrabel.OpenApp.Startup;
using Abp.AutoMapper;
using Abp.Zero.Configuration;

namespace Satrabel.Starter.Web.Startup
{
    [DependsOn(typeof(OpenAppWebCoreModule))]
    public class WebMvcModule : AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;
        private readonly IMigrationManager _migrationManager;
        private readonly IWebConfig _webConfig;

        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }
        public bool SkipDbSeed { get; set; }

        public WebMvcModule(IHostingEnvironment env, IMigrationManager migrationManager, IWebConfig webConfig)
        {
            _env = env;
            _migrationManager = migrationManager;
            _appConfiguration = env.GetAppConfiguration();
            _webConfig = webConfig;
        }

        public override void PreInitialize()
        {
            // for entity framework
            if (!SkipDbContextRegistration)
            {
                Configuration.Modules.AbpEfCore().AddDbContext<AppDbContext>(options =>
                {
                    if (options.ExistingConnection != null)
                    {
                        AppDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                    }
                    else
                    {
                        AppDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                    }
                });
            }

            // Load localization keys
            LocalizationConfigurer.Configure(Configuration.Localization); 

            // Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = AppConsts.MultiTenancyEnabled;

            _webConfig.MetaTitle = AppConsts.MetaTitle;
            _webConfig.FooterLinkText = AppConsts.FooterLinkText;
            _webConfig.FooterLinkUrl = AppConsts.FooterLinkUrl;
            _webConfig.FooterCopyright = AppConsts.FooterCopyright;

            // Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            // automatic webapi's for Application Services
            Configuration.Modules.AbpAspNetCore()
                .CreateControllersForAppServices(
                    typeof(WebMvcModule).GetAssembly()
                );

            // Permissions
            Configuration.Authorization.Providers.Add<AuthorizationProvider>();
            Configuration.Navigation.Providers.Add<NavigationProvider>();

            if (_migrationManager.NeedMigration && !SkipDbContextRegistration)
            {
                _migrationManager.Configure(Configuration, IocManager);
            }
        }

        public override void Initialize()
        {
            Assembly thisAssembly = typeof(WebMvcModule).GetAssembly();
            IocManager.RegisterAssemblyByConvention(thisAssembly);
            Configuration.Modules.AbpAutoMapper().Configurators.Add(cfg =>
            {
                //Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg.AddProfiles(thisAssembly);
            });
        }
        public override void PostInitialize()
        {
            if (_migrationManager.NeedMigration && !SkipDbContextRegistration)
            {
                _migrationManager.Run<MultiTenantMigrateExecuter>(IocManager);
            }
            else if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb<AppDbContext>(IocManager);
            }
        }
    }
}