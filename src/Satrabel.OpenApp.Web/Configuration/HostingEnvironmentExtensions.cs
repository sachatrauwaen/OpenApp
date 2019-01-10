using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Satrabel.OpenApp.Configuration
{
    public static class HostingEnvironmentExtensions
    {
        public static IConfigurationRoot GetAppConfiguration(this IHostingEnvironment env)
        {
            string settingpath = Satrabel.OpenApp.Web.WebContentDirectoryFinder.CalculateContentRootFolder(env.ContentRootPath);
            return AppConfigurations.Get(settingpath, env.EnvironmentName, env.IsDevelopment());
        }
    }
}
