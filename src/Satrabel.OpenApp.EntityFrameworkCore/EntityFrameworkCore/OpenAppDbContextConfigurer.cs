using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Satrabel.OpenApp.EntityFrameworkCore
{
    public static class OpenAppDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<OpenAppDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString, opt => opt.UseRowNumberForPaging());
        }

        public static void Configure(DbContextOptionsBuilder<OpenAppDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection, opt => opt.UseRowNumberForPaging());
        }
    }
}