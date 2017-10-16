using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;
using Abp.EntityFrameworkCore.Configuration;
using Satrabel.OpenApp.EntityFrameworkCore;
using Satrabel.OpenApp.Web.Localization;
using Satrabel.OpenApp.EntityFrameworkCore.Seed;
using Satrabel.OpenApp.Configuration;
using Satrabel.Starter.Web.Authorization;
using Satrabel.Starter.EntityFrameworkCore;
using Abp.MultiTenancy;
using Satrabel.Starter.Migrator;
using Abp.Dependency;
using Abp.Threading.BackgroundWorkers;
using System;
using System.Data.SqlClient;
using Abp.Events.Bus;
using Castle.MicroKernel.Registration;
using System.IO;
using Abp.Threading;
using Abp.BackgroundJobs;

namespace Satrabel.Starter.Web.Startup
{
    [DependsOn(typeof(OpenAppWebCoreModule))]
    public class StarterWebMvcModule : AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        private bool ExecuteMigrations;
        private string versionFile;

        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }
        public bool SkipDbSeed { get; set; }

        public StarterWebMvcModule(IHostingEnvironment env)
        {
            
            _env = env;
            _appConfiguration = env.GetAppConfiguration();

            versionFile = env.ContentRootPath + "\\App_Data\\version.txt";
            ExecuteMigrations = !File.Exists(versionFile);
            //File.ReadAllLines();
            

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

            Configuration.BackgroundJobs.IsJobExecutionEnabled = !ExecuteMigrations;

            //if (ExecuteMigrations)
            //{
            //    Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            //    Configuration.ReplaceService(typeof(IEventBus), () =>
            //    {
            //        IocManager.IocContainer.Register(
            //            Component.For<IEventBus>().Instance(NullEventBus.Instance)
            //        );
            //    });
            //}
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StarterWebMvcModule).GetAssembly());
        }
        public override void PostInitialize()
        {
            if (ExecuteMigrations)
            {
                //if (Configuration.BackgroundJobs.IsJobExecutionEnabled)
                //{
                //    IocManager.Resolve<IBackgroundWorkerManager>().StopAndWaitToStop();
                //}

                bool _skipConnVerification = false;
                using (var migrateExecuter = IocManager.ResolveAsDisposable<MultiTenantMigrateExecuter>())
                {
                    migrateExecuter.Object.Run(_skipConnVerification);
                }

                File.WriteAllText(versionFile, "1");

                //if (Configuration.BackgroundJobs.IsJobExecutionEnabled)
                //{
                    var workerManager = IocManager.Resolve<IBackgroundWorkerManager>();
                    workerManager.Start();
                    workerManager.Add(IocManager.Resolve<IBackgroundJobManager>());
                //}
            }
            else if (!SkipDbSeed)
            {
                //try
                //{
                //    SeedHelper.SeedHostDb<StarterDbContext>(IocManager);
                //}
                //catch (SqlException ex)
                //{
                //    if (ex.Number == 208) // table not exist
                //    {
                //        // automatic migrations execution if table not exist
                //        if (Configuration.BackgroundJobs.IsJobExecutionEnabled)
                //        {
                //            IocManager.Resolve<IBackgroundWorkerManager>().Stop();
                //            IocManager.Resolve<IBackgroundWorkerManager>().WaitToStop();
                //        }
                //        bool _skipConnVerification = false;
                //        using (var migrateExecuter = IocManager.ResolveAsDisposable<MultiTenantMigrateExecuter>())
                //        {
                //            migrateExecuter.Object.Run(_skipConnVerification);
                //        }
                //    }
                //    else
                //    {
                //        throw;
                //    }
                //}
                SeedHelper.SeedHostDb<StarterDbContext>(IocManager);
            }
        }
    }
}