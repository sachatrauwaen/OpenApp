using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;

using Satrabel.OpenApp;
using Satrabel.OpenApp.EntityFramework.Seed;
using Satrabel.Starter.EntityFramework;

namespace Satrabel.Starter.Web.Startup
{
    [DependsOn(
        typeof(OpenAppCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class EntityFrameworkModule : AbpModule // for tests only
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

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
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(EntityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb<AppDbContext>(IocManager);
            }
        }
    }
}