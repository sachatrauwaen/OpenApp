using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using Abp.EntityFrameworkCore;
using Satrabel.OpenApp.EntityFramework;

namespace Satrabel.Starter.EntityFramework
{
    public class StarterDbContext : OpenAppDbContext<StarterDbContext>
    {
        /* Define an IDbSet for each entity of the application */

        public StarterDbContext(DbContextOptions<StarterDbContext>  options)
            : base(options)
        {

        }
    }
}
