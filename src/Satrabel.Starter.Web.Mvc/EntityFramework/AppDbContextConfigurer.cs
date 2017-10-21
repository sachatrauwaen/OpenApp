using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Satrabel.Starter.EntityFramework
{
    public static class AppDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AppDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString, opt => opt.UseRowNumberForPaging());
        }

        public static void Configure(DbContextOptionsBuilder<AppDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection, opt => opt.UseRowNumberForPaging());
        }
    }
}