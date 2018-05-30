using Satrabel.OpenApp.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Satrabel.Starter.EntityFramework
{
    /// <summary>
    /// This class is used to run "dotnet ef ..." commands from command line on development,
    /// nowhere else.
    /// </summary>
    /// <remarks>
    /// we don't have HostingEnvironment here
    /// </remarks>
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var configuration = AppConfigurations.Get(typeof(AppDbContextFactory).Assembly, null, true);

            AppDbContextConfigurer.Configure(builder, configuration.GetConnectionString(Web.AppConsts.ConnectionStringName));

            return new AppDbContext(builder.Options);
        }
    }
}