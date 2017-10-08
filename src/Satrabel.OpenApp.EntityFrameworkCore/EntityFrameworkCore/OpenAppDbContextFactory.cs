using Satrabel.OpenApp.Configuration;
using Satrabel.OpenApp.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Satrabel.OpenApp.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class OpenAppDbContextFactory : IDesignTimeDbContextFactory<OpenAppDbContext>
    {
        public OpenAppDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<OpenAppDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            OpenAppDbContextConfigurer.Configure(builder, configuration.GetConnectionString(OpenAppConsts.ConnectionStringName));

            return new OpenAppDbContext(builder.Options);
        }
    }
}