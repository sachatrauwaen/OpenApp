using System;
using System.Collections.Generic;
using Abp.Collections.Extensions;
using Abp.Dependency;
using System.IO;
using System.Linq;
using Abp.Resources.Embedded;
using Abp.IO.Extensions;

namespace Satrabel.OpenApp.Web.Resources.Embedded
{
    public class EmbeddedResourceManager : IEmbeddedResourceManager, ISingletonDependency
    {
        private readonly IEmbeddedResourcesConfiguration _configuration;
        private readonly Lazy<Dictionary<string, EmbeddedResourceItem>> _resources;

        /// <summary>
        /// Constructor.
        /// </summary>
        public EmbeddedResourceManager(IEmbeddedResourcesConfiguration configuration)
        {
            _configuration = configuration;
            _resources = new Lazy<Dictionary<string, EmbeddedResourceItem>>(
                CreateResourcesDictionary,
                true
            );
        }

        /// <inheritdoc/>
        public EmbeddedResourceItem GetResource(string fullPath)
        {
            var encodedPath = EmbeddedResourcePathHelper.EncodeAsResourcesPath(fullPath);
            return _resources.Value.GetOrDefault(encodedPath);
        }

        public IEnumerable<EmbeddedResourceItem> GetResources(string fullPath)
        {
            var encodedPath = EmbeddedResourcePathHelper.EncodeAsResourcesPath(fullPath);
            if (encodedPath.Length > 0 && !encodedPath.EndsWith("."))
            {
                encodedPath = encodedPath + ".";
            }

            // We will assume that any file starting with this path, is in that directory.
            // NOTE: This may include false positives, but helps in the majority of cases until 
            // https://github.com/aspnet/FileSystem/issues/184 is solved.

            return _resources.Value.Where(k => k.Key.StartsWith(encodedPath)).Select(d => d.Value);
        }

        private Dictionary<string, EmbeddedResourceItem> CreateResourcesDictionary()
        {
            var resources = new Dictionary<string, EmbeddedResourceItem>(StringComparer.OrdinalIgnoreCase);

            foreach (var source in _configuration.Sources)
            {
                AddResources(source, resources);
            }
            return resources;
        }

        private void AddResources(EmbeddedResourceSet source, Dictionary<string, EmbeddedResourceItem> resources)
        {
            foreach (var resourceName in source.Assembly.GetManifestResourceNames())
            {
                if (!resourceName.StartsWith(source.ResourceNamespace))
                {
                    continue;
                }

                using (var stream = source.Assembly.GetManifestResourceStream(resourceName))
                {
                    var relativePath = ConvertToRelativePath(source, resourceName);
                    var filePath = EmbeddedResourcePathHelper.NormalizePath(source.RootPath) + relativePath;

                    resources[filePath] = new EmbeddedResourceItem(
                        filePath,
                        stream.GetAllBytes(),
                        source.Assembly
                    );
                }
            }
        }

        private string ConvertToRelativePath(EmbeddedResourceSet source, string resourceName)
        {
            return resourceName.Substring(source.ResourceNamespace.Length + 1);
        }

        class EmbeddedResourceItemComparer : IEqualityComparer<string>
        {
            public bool Equals(string fullPath1, string fullPath2)
            {
                return InvariantResourceName(fullPath1).Equals(InvariantResourceName(fullPath2));
            }

            public int GetHashCode(string fullPath)
            {
                return InvariantResourceName(fullPath).GetHashCode();
            }
            private string InvariantResourceName(string fullPath)
            {
                return fullPath.Replace("/", ".");
            }

        }
    }
}