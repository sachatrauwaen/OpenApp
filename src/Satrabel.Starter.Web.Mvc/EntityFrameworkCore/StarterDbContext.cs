using Abp.Zero.EntityFrameworkCore;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.MultiTenancy;
using Microsoft.EntityFrameworkCore;

using Abp.EntityFrameworkCore;

namespace Satrabel.Starter.EntityFrameworkCore
{
    public class StarterDbContext : AbpDbContext
    {
        /* Define an IDbSet for each entity of the application */

        public StarterDbContext(DbContextOptions options)
            : base(options)
        {

        }
    }
}
