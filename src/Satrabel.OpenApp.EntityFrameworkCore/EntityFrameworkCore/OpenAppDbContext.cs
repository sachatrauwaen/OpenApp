using Abp.Zero.EntityFrameworkCore;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Satrabel.OpenApp.EntityFrameworkCore
{
    public class OpenAppDbContext : AbpZeroDbContext<Tenant, Role, User, OpenAppDbContext>
    {
        /* Define an IDbSet for each entity of the application */
        
        public OpenAppDbContext(DbContextOptions<OpenAppDbContext> options)
            : base(options)
        {

        }
    }
}
