using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.MultiTenancy;

namespace Satrabel.OpenApp.EntityFrameworkCore
{
    public abstract class OpenAppDbContext<TSelf> : AbpZeroDbContext<Tenant, Role, User, TSelf>
        where TSelf : OpenAppDbContext<TSelf>
    {
        /* Define an IDbSet for each entity of the application */
        
        protected OpenAppDbContext(DbContextOptions<TSelf> options)
            : base(options)
        {

        }
    }
}
