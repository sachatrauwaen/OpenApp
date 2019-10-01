using Abp.Runtime.Caching;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Identity
{
    public static class OpenAppCacheManagerExtensions
    {
        public static ITypedCache<string, ImpersonationCacheItem> GetImpersonationCache(this ICacheManager cacheManager)
        {
            return cacheManager.GetCache<string, ImpersonationCacheItem>(ImpersonationCacheItem.CacheStoreName);
        }
    }
}
