using System.Linq;
using Microsoft.EntityFrameworkCore;
using Abp.MultiTenancy;
using Satrabel.OpenApp.Editions;
using Satrabel.OpenApp.MultiTenancy;

namespace Satrabel.OpenApp.EntityFramework.Seed.Tenants
{
    public class DefaultTenantBuilder<TSelf>
         where TSelf : OpenAppDbContext<TSelf>
    {
        private readonly OpenAppDbContext<TSelf> _context;

        public DefaultTenantBuilder(OpenAppDbContext<TSelf> context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateDefaultTenant();
        }

        private void CreateDefaultTenant()
        {
            // Default tenant

            var defaultTenant = _context.Tenants.IgnoreQueryFilters().FirstOrDefault(t => t.TenancyName == AbpTenantBase.DefaultTenantName);
            if (defaultTenant == null)
            {
                defaultTenant = new Tenant(AbpTenantBase.DefaultTenantName, AbpTenantBase.DefaultTenantName);

                var defaultEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
                if (defaultEdition != null)
                {
                    defaultTenant.EditionId = defaultEdition.Id;
                }

                _context.Tenants.Add(defaultTenant);
                _context.SaveChanges();
            }
        }
    }
}
