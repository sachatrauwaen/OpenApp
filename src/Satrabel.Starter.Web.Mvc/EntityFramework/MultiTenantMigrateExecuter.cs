using System;
using System.Collections.Generic;
using Abp.Data;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Satrabel.OpenApp.EntityFramework.Seed;
using Satrabel.OpenApp.MultiTenancy;
using Satrabel.OpenApp.Web.Migration;
using Castle.Core.Logging;

namespace Satrabel.Starter.EntityFramework
{
    public class MultiTenantMigrateExecuter : ITransientDependency, IMigratorExecuter
    {
        public ILogger Logger { get; set; }

        private readonly AbpZeroDbMigrator _migrator;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IDbPerTenantConnectionStringResolver _connectionStringResolver;

        public MultiTenantMigrateExecuter(
            AbpZeroDbMigrator migrator,
            IRepository<Tenant> tenantRepository,
            IDbPerTenantConnectionStringResolver connectionStringResolver)
        {
            Logger = NullLogger.Instance;
            _migrator = migrator;
            _tenantRepository = tenantRepository;
            _connectionStringResolver = connectionStringResolver;
        }

        public void Run()
        {
            var hostConnStr = _connectionStringResolver.GetNameOrConnectionString(new ConnectionStringResolveArgs(MultiTenancySides.Host));
            if (hostConnStr.IsNullOrWhiteSpace())
            {
                Logger.Info("Configuration file should contain a connection string named 'Default'");
                return;
            }

            Logger.Info("Host database: " + ConnectionStringHelper.GetConnectionString(hostConnStr));

            Logger.Info("HOST database migration started...");

            try
            {
                _migrator.CreateOrMigrateForHost(SeedHelper.SeedHostDb);
                
            }
            catch (Exception ex)
            {
                Logger.Info("An error occured during migration of host database:");
                Logger.Info(ex.ToString());
                Logger.Info("Canceled migrations.");
                return;
            }

            Logger.Info("HOST database migration completed.");
            Logger.Info("--------------------------------------------------------");

            var migratedDatabases = new HashSet<string>();
            var tenants = _tenantRepository.GetAllList(t => t.ConnectionString != null && t.ConnectionString != "");
            for (int i = 0; i < tenants.Count; i++)
            {
                var tenant = tenants[i];
                Logger.Info(string.Format("Tenant database migration started... ({0} / {1})", (i + 1), tenants.Count));
                Logger.Info("Name              : " + tenant.Name);
                Logger.Info("TenancyName       : " + tenant.TenancyName);
                Logger.Info("Tenant Id         : " + tenant.Id);
                Logger.Info("Connection string : " + SimpleStringCipher.Instance.Decrypt(tenant.ConnectionString));

                if (!migratedDatabases.Contains(tenant.ConnectionString))
                {
                    try
                    {
                        _migrator.CreateOrMigrateForTenant(tenant);
                    }
                    catch (Exception ex)
                    {
                        Logger.Info("An error occured during migration of tenant database:");
                        Logger.Info(ex.ToString());
                        Logger.Info("Skipped this tenant and will continue for others...");
                    }

                    migratedDatabases.Add(tenant.ConnectionString);
                }
                else
                {
                    Logger.Info("This database has already migrated before (you have more than one tenant in same database). Skipping it....");
                }

                Logger.Info(string.Format("Tenant database migration completed. ({0} / {1})", (i + 1), tenants.Count));
                Logger.Info("--------------------------------------------------------");
            }

            Logger.Info("All databases have been migrated.");
            
        }
    }
}