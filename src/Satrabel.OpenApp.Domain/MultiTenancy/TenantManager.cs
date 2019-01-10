using Abp.Application.Features;
using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.Editions;

namespace Satrabel.OpenApp.MultiTenancy
{
    public class TenantManager : AbpTenantManager<Tenant, User>
    {
        public TenantManager(
            IRepository<Tenant> tenantRepository, 
            IRepository<TenantFeatureSetting, long> tenantFeatureRepository, 
            EditionManager editionManager,
            IAbpZeroFeatureValueStore featureValueStore) 
            : base(
                tenantRepository, 
                tenantFeatureRepository, 
                editionManager,
                featureValueStore)
        {
        }
    }
}