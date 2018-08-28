using Microsoft.EntityFrameworkCore;
using Satrabel.OpenApp.EntityFramework;
using Satrabel.Starter.Web.Domain.Cms;

namespace Satrabel.Starter.EntityFramework
{
    public class AppDbContext : OpenAppDbContext<AppDbContext>
    {
        /* Define an IDbSet for each entity of the application */

        public DbSet<Page> Pages { get; set; }
        public DbSet<PageModule> PageModules { get; set; }
        public DbSet<PageTranslation> PageTranslations { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<ModuleTranslation> ModuleTranslations { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext>  options)
            : base(options)
        {

        }
    }
}
