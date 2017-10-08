using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;

namespace Satrabel.Starter.Web.Startup
{
    [DependsOn(typeof(OpenAppWebCoreModule))]
    public class StarterWebMvcModule : AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public StarterWebMvcModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void PreInitialize()
        {
            Configuration.Navigation.Providers.Add<StarterNavigationProvider>();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(StarterWebMvcModule).GetAssembly());
        }
    }
}