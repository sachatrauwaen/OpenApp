using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using Abp.EntityFrameworkCore;
using Satrabel.OpenApp.EntityFramework;

namespace Satrabel.Starter.EntityFramework
{
    public class AppDbContext : OpenAppDbContext<AppDbContext>
    {
        /* Define an IDbSet for each entity of the application */

        public AppDbContext(DbContextOptions<AppDbContext>  options)
            : base(options)
        {

        }
    }
}
