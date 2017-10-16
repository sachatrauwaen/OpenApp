using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Migrator.DependencyInjection;
using Satrabel.Starter.Web.Startup;

namespace Satrabel.OpenApp.Migrator
{
    [DependsOn(typeof(StarterWebMvcModule), typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class OpenAppMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public OpenAppMigratorModule(StarterWebMvcModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(OpenAppMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                OpenAppConsts.ConnectionStringName
                );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(typeof(IEventBus), () =>
            {
                IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                );
            });
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OpenAppMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}