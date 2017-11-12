using Abp.MultiTenancy;
using Satrabel.OpenApp.Authorization.Users;

namespace Satrabel.OpenApp.MultiTenancy
{
    public class Tenant : AbpTenant<User>
    {
        public Tenant()
        {
            
        }

        public Tenant(string tenancyName, string name)
            : base(tenancyName, name)
        {
        }
    }
}