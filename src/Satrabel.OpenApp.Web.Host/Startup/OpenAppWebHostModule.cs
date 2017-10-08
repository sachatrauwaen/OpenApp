using System.Reflection;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Satrabel.OpenApp.Web.Host.Startup
{
    [DependsOn(
       typeof(OpenAppWebCoreModule))]
    public class OpenAppWebHostModule: AbpModule
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public OpenAppWebHostModule(IHostingEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OpenAppWebHostModule).GetAssembly());
        }
    }
}
