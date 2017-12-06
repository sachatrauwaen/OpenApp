using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;
using Abp.EntityFrameworkCore.Configuration;
using Satrabel.OpenApp.EntityFramework;
using Satrabel.Starter.Web.Localization;
using Satrabel.OpenApp.EntityFramework.Seed;
using Satrabel.OpenApp.Configuration;
using Satrabel.Starter.Web.Authorization;
using Satrabel.Starter.EntityFramework;
using Abp.MultiTenancy;
using Abp.Dependency;
using Abp.Threading.BackgroundWorkers;
using System;
using System.Data.SqlClient;
using Abp.Events.Bus;
using Castle.MicroKernel.Registration;
using System.IO;
using Abp.Threading;
using Abp.BackgroundJobs;
using Satrabel.OpenApp.Web.Migration;
using Abp.AspNetCore.Configuration;
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


        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }
        public bool SkipDbSeed { get; set; }

        public WebMvcModule(IHostingEnvironment env, IMigrationManager migrationManager)
        {
            _env = env;
            _migrationManager = migrationManager;
            _appConfiguration = env.GetAppConfiguration();

        }

        public override void PreInitialize()
        {
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
            LocalizationConfigurer.Configure(Configuration.Localization);
            //Enable this line to create a multi-tenant application.
            Configuration.MultiTenancy.IsEnabled = AppConsts.MultiTenancyEnabled;

            //Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            Configuration.Modules.AbpAspNetCore()
                 .CreateControllersForAppServices(
                     typeof(WebMvcModule).GetAssembly()
                 );
            Configuration.Authorization.Providers.Add<AuthorizationProvider>();
            Configuration.Navigation.Providers.Add<NavigationProvider>();

            //Configuration.BackgroundJobs.IsJobExecutionEnabled = !ExecuteMigrations;
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
                //if (Configuration.BackgroundJobs.IsJobExecutionEnabled)
                //{
                //    IocManager.Resolve<IBackgroundWorkerManager>().StopAndWaitToStop();
                //}

                //bool _skipConnVerification = false;
                //using (var migrateExecuter = IocManager.ResolveAsDisposable<MultiTenantMigrateExecuter>())
                //{
                //    migrateExecuter.Object.Run(_skipConnVerification);
                //}



                //if (Configuration.BackgroundJobs.IsJobExecutionEnabled)
                //{
                //var workerManager = IocManager.Resolve<IBackgroundWorkerManager>();
                //workerManager.Start();
                //workerManager.Add(IocManager.Resolve<IBackgroundJobManager>());
                //}
            }
            else if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb<AppDbContext>(IocManager);
            }
        }
    }
}