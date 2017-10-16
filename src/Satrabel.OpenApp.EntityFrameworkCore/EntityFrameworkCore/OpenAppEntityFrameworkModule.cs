using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Satrabel.OpenApp.EntityFrameworkCore.Seed;
using Satrabel.OpenApp;

namespace Satrabel.OpenApp.EntityFrameworkCore
{
    [DependsOn(
        typeof(OpenAppCoreModule), 
        typeof(AbpZeroCoreEntityFrameworkCoreModule))]
    public class OpenAppEntityFrameworkModule : AbpModule
    {

        public override void PreInitialize()
        {
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OpenAppEntityFrameworkModule).GetAssembly());
        }

        
    }
}