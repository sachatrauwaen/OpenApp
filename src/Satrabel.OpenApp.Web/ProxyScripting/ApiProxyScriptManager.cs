using System;
using System.Collections.Concurrent;
using Abp;
using Abp.Collections.Extensions;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Json;
using Abp.Web.Api.Modeling;
using Abp.Web.Api.ProxyScripting.Configuration;
using Abp.Web.Api.ProxyScripting.Generators;
using Castle.Core.Logging;
using IApiDescriptionModelProvider = Satrabel.OpenApp.ProxyScripting.Modeling.IApiDescriptionModelProvider;

namespace Satrabel.OpenApp.ProxyScripting
{
    public class ApiProxyScriptManager : IApiProxyScriptManager, ISingletonDependency
    {
        public ILogger Logger { get; set; }

        private readonly IApiDescriptionModelProvider _modelProvider;
        private readonly IApiProxyScriptingConfiguration _configuration;
        private readonly IIocResolver _iocResolver;

        private readonly ConcurrentDictionary<string, string> _cache;

        public ApiProxyScriptManager(
            IApiDescriptionModelProvider modelProvider,
            IApiProxyScriptingConfiguration configuration,
            IIocResolver iocResolver)
        {
            _modelProvider = modelProvider;
            _configuration = configuration;
            _iocResolver = iocResolver;
            Logger = NullLogger.Instance;

            _cache = new ConcurrentDictionary<string, string>();
        }

        public string GetScript(Abp.Web.Api.ProxyScripting.ApiProxyGenerationOptions options)
        {
            if (options.UseCache)
            {
                return _cache.GetOrAdd(CreateCacheKey(options), (key) => CreateScript(options));
            }

            return _cache[CreateCacheKey(options)] = CreateScript(options);
        }

        private string CreateScript(Abp.Web.Api.ProxyScripting.ApiProxyGenerationOptions options)
        {
            var model = _modelProvider.CreateModel();

            if (options.IsPartialRequest())
            {
                model = model.CreateSubModel(options.Modules, options.Controllers, options.Actions);
            }

            var generatorType = _configuration.Generators.GetOrDefault(options.GeneratorType);
            if (generatorType == null)
            {
                throw new AbpException($"Could not find a proxy script generator with given name: {options.GeneratorType}");
            }

            try
            {
                using (var generator = _iocResolver.ResolveAsDisposable<IProxyScriptGenerator>(generatorType))
                {
                    return generator.Object.CreateScript(model);
                }
            }
            catch (Exception e)
            {
                Logger.Error("Error generating script: " + e);
                Console.WriteLine(e);
            }

            model = new ApplicationApiDescriptionModel();
            model.AddModule(new ModuleApiDescriptionModel("CouldNotGenerateSchema_SeeLogForMoreInfo"));

            using (var generator = _iocResolver.ResolveAsDisposable<IProxyScriptGenerator>(generatorType))
            {
                return generator.Object.CreateScript(model);
            }
        }

        private static string CreateCacheKey(Abp.Web.Api.ProxyScripting.ApiProxyGenerationOptions options)
        {
            return options.ToJsonString().ToMd5();
        }
    }
}
