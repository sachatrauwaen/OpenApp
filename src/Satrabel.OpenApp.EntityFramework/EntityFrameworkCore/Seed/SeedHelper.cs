using System;
using System.Transactions;
using Microsoft.EntityFrameworkCore;
using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.EntityFrameworkCore.Uow;
using Abp.MultiTenancy;
using Satrabel.OpenApp.EntityFramework.Seed.Host;
using Satrabel.OpenApp.EntityFramework.Seed.Tenants;

namespace Satrabel.OpenApp.EntityFramework.Seed
{
    public static class SeedHelper
    {
        public static void SeedHostDb<TSelf>(IIocResolver iocResolver)
            where TSelf : OpenAppDbContext<TSelf>
        {
            WithDbContext<TSelf>(iocResolver, SeedHostDb);
        }

        public static void SeedHostDb<TSelf>(TSelf context)
            where TSelf : OpenAppDbContext<TSelf>
        {
            context.SuppressAutoSetTenantId = true;

            // Host seed
            new InitialHostDbBuilder<TSelf>(context).Create();

            // Default tenant seed (in host database).
            new DefaultTenantBuilder<TSelf>(context).Create();
            new TenantRoleAndUserBuilder<TSelf>(context, 1).Create();
        }

        private static void WithDbContext<TDbContext>(IIocResolver iocResolver, Action<TDbContext> contextAction)
            where TDbContext : DbContext
        {
            using (var uowManager = iocResolver.ResolveAsDisposable<IUnitOfWorkManager>())
            {
                using (var uow = uowManager.Object.Begin(TransactionScopeOption.Suppress))
                {
                    var context = uowManager.Object.Current.GetDbContext<TDbContext>(MultiTenancySides.Host);

                    contextAction(context);

                    uow.Complete();
                }
            }
        }
    }
}
