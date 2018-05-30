using System;
using System.IO;

using Microsoft.Extensions.FileProviders;
using Satrabel.OpenApp.Web.Resources.Embedded;

namespace Satrabel.OpenApp.Web.EmbeddedResources
{
    public class EmbeddedResourceItemFileInfo : IFileInfo
    {
        public bool Exists => true;

        public long Length => _resourceItem.Content.Length;

        public string PhysicalPath => null;

        public string Name => _name;

        public DateTimeOffset LastModified => _resourceItem.LastModifiedUtc;

        public bool IsDirectory => false;
        
        private readonly EmbeddedResourceItem _resourceItem;
        private readonly string _name;

        public EmbeddedResourceItemFileInfo(EmbeddedResourceItem resourceItem, string name)
        {
            _resourceItem = resourceItem;
            _name = name;
        }

        public Stream CreateReadStream()
        {
            return new MemoryStream(_resourceItem.Content);
        }
    }
}