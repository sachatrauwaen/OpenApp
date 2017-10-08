using System.Reflection;
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
            Configuration.Authorization.Providers.Add<JobManagerAuthorizationProvider>();
        }

        public override void Initialize()
        {
            Assembly thisAssembly = typeof(OpenAppApplicationModule).GetAssembly();
            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(cfg =>
            {
                //Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg.AddProfiles(thisAssembly);
            });

            
        }
    }
}