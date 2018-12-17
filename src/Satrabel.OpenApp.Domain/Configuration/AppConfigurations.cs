using System.Collections.Concurrent;
using Microsoft.Extensions.Configuration;
using Abp.Extensions;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp.Web;
using System;
using System.IO;
using System.Reflection;

namespace Satrabel.OpenApp.Configuration
{
    public static class AppConfigurations
    {
        private static readonly ConcurrentDictionary<string, IConfigurationRoot> _configurationCache;

        static AppConfigurations()
        {
            _configurationCache = new ConcurrentDictionary<string, IConfigurationRoot>();
        }

        public static IConfigurationRoot Get(string path, string environmentName = null, bool addUserSecrets = false)
        {
            var cacheKey = path + "#" + environmentName + "#" + addUserSecrets;
            return _configurationCache.GetOrAdd(
                cacheKey,
                _ => BuildConfiguration(path, environmentName, addUserSecrets)
            );
        }

        public static IConfigurationRoot Get(Assembly assembly, string environmentName = null, bool addUserSecrets = false)
        {
            var cacheKey = assembly.FullName + "#" + environmentName + "#" + addUserSecrets;
            return _configurationCache.GetOrAdd(
                cacheKey,
                _ => BuildConfiguration(assembly, environmentName, addUserSecrets)
            );
        }

        /// <summary>
        /// based on http://www.michielpost.nl/PostDetail_2081.aspx
        /// </summary>
        /// <param name="path"></param>
        /// <param name="environmentName"></param>
        /// <param name="addUserSecrets"></param>
        /// <returns></returns>
        /// <remarks>
        /// Searches for 
        ///  - appsettings.json
        ///  - appsettings.{environmentName}.json (Staging,Development, ...) //http://docs.asp.net/en/latest/fundamentals/environments.html
        ///  - /Configuration/appsettings.{computerName}.json // in subfolder that can be excluded from .git
        ///  - EnvironmentVariables()
        /// </remarks>
        private static IConfigurationRoot BuildConfiguration(string path, string environmentName = null, bool addUserSecrets = false)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            if (!environmentName.IsNullOrWhiteSpace())
            {
                builder = builder.AddJsonFile($"appsettings.{environmentName}.json", optional: true);
            }

            var computerName = Environment.GetEnvironmentVariable("COMPUTERNAME");
            builder = builder.AddJsonFile(Path.Combine("LocalConfig", $"appsettings.{computerName}.json"), optional: true);

            builder = builder.AddEnvironmentVariables();

            // https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=visual-studio
            if (addUserSecrets)
            {
                builder.AddUserSecrets(typeof(AppConfigurations).GetAssembly()); // watch out. not compatible with core2 https://github.com/aspnet/Announcements/issues/223
            }

            return builder.Build();
        }

        /// <summary>
        /// based on http://www.michielpost.nl/PostDetail_2081.aspx
        /// </summary>
        /// <param name="assembly"></param>
        /// <param name="environmentName"></param>
        /// <param name="addUserSecrets"></param>
        /// <returns></returns>
        /// <remarks>
        /// Searches for 
        ///  - appsettings.json
        ///  - appsettings.{environmentName}.json (Staging,Development, ...) // http://docs.asp.net/en/latest/fundamentals/environments.html
        ///  - /LocalConfig/appsettings.{computerName}.json // in subfolder that can be excluded from .git
        ///  - EnvironmentVariables()
        /// </remarks>
        private static IConfigurationRoot BuildConfiguration(Assembly assembly, string environmentName = null, bool addUserSecrets = false)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(WebContentDirectoryFinder.CalculateContentRootFolder(assembly))
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            if (!environmentName.IsNullOrWhiteSpace())
            {
                builder = builder.AddJsonFile($"appsettings.{environmentName}.json", optional: true);
            }

            var computerName = Environment.GetEnvironmentVariable("COMPUTERNAME");
            builder = builder.AddJsonFile(Path.Combine("LocalConfig", $"appsettings.{computerName}.json"), optional: true);

            builder = builder.AddEnvironmentVariables();

            // https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=visual-studio
            if (addUserSecrets)
            {
                builder.AddUserSecrets(assembly); // watch out. not compatible with core2 https://github.com/aspnet/Announcements/issues/223
            }

            return builder.Build();
        }
    }
}
