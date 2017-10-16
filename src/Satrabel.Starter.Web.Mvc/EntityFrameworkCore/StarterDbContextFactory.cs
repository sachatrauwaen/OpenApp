using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Satrabel.OpenApp;
using Satrabel.Starter.Web;

namespace Satrabel.Starter.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class StarterDbContextFactory : IDesignTimeDbContextFactory<StarterDbContext>
    {
        public StarterDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<StarterDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            StarterDbContextConfigurer.Configure(builder, configuration.GetConnectionString(StarterConsts.ConnectionStringName));

            return new StarterDbContext(builder.Options);
        }
    }
}