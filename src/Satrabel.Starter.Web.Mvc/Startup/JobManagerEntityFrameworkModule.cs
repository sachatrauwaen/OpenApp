using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;

using Satrabel.OpenApp;
using Satrabel.OpenApp.EntityFrameworkCore.Seed;
using Satrabel.Starter.EntityFrameworkCore;

namespace Satrabel.JobManager.EntityFrameworkCore
{
    [DependsOn(
        typeof(OpenAppCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class StartertityFrameworkModule : AbpModule // for tests only
    {
        /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
        public bool SkipDbContextRegistration { get; set; }

        public bool SkipDbSeed { get; set; }

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
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StartertityFrameworkModule).GetAssembly());
        }

        public override void PostInitialize()
        {
            if (!SkipDbSeed)
            {
                SeedHelper.SeedHostDb<StarterDbContext>(IocManager);
            }
        }
    }
}