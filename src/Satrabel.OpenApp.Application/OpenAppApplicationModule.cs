using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp.Authorization;
using Abp.MailKit;

namespace Satrabel.OpenApp
{
    [DependsOn(
        typeof(OpenAppCoreModule), 
        typeof(AbpAutoMapperModule),
        typeof(AbpMailKitModule))]
    public class OpenAppApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<OpenAppAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(OpenAppApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddProfiles(thisAssembly)
            );
        }
    }
}