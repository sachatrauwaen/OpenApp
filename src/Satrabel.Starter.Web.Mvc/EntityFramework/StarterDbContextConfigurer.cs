using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Satrabel.Starter.EntityFramework
{
    public static class StarterDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<StarterDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString, opt => opt.UseRowNumberForPaging());
        }

        public static void Configure(DbContextOptionsBuilder<StarterDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection, opt => opt.UseRowNumberForPaging());
        }
    }
}