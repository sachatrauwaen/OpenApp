using System;
using Abp.AutoMapper;
using Abp.Dependency;
using Abp.Modules;
using Abp.Configuration.Startup;
using Abp.Net.Mail;
using Abp.TestBase;
using Abp.Zero.Configuration;
using Abp.Zero.EntityFrameworkCore;
using Satrabel.OpenApp.EntityFramework;
using Satrabel.OpenApp.Tests.DependencyInjection;
using Castle.MicroKernel.Registration;
using NSubstitute;
using Satrabel.OpenApp.Web.Startup;
using Satrabel.Starter.Web.Startup;
using Satrabel.Starter.EntityFramework;
using Satrabel.OpenApp.Web.Localization;
using Abp.Reflection.Extensions;
using Abp.AspNetCore;

namespace Satrabel.OpenApp.Tests
{
    [DependsOn(
        typeof(OpenAppApplicationModule),
        typeof(EntityFrameworkModule),
        typeof(AbpTestBaseModule)
        )]
    public class JobManagerTestModule : AbpModule
    {
        public JobManagerTestModule(EntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        }

        public override void PreInitialize()
        {
            Configuration.UnitOfWork.Timeout = TimeSpan.FromMinutes(30);
            Configuration.UnitOfWork.IsTransactional = false;

            //Disable static mapper usage since it breaks unit tests (see https://github.com/aspnetboilerplate/aspnetboilerplate/issues/2052)
            Configuration.Modules.AbpAutoMapper().UseStaticMapper = false;

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;

            //StarterLocalizationConfigurer.Configure(Configuration.Localization);

            //Use database for language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            RegisterFakeService<AbpZeroDbMigrator<AppDbContext>>();

            Configuration.ReplaceService<IEmailSender, NullEmailSender>(DependencyLifeStyle.Transient);
        }

        public override void Initialize()
        {
            
            ServiceCollectionRegistrar.Register(IocManager);
        }

        private void RegisterFakeService<TService>() where TService : class
        {
            IocManager.IocContainer.Register(
                Component.For<TService>()
                    .UsingFactoryMethod(() => Substitute.For<TService>())
                    .LifestyleSingleton()
            );
        }
    }
}