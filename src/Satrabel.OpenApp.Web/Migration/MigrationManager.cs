using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Events.Bus;
using Castle.MicroKernel.Registration;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Satrabel.OpenApp.Web.Migration
{
    public class MigrationManager : IMigrationManager, ISingletonDependency
    {
        private bool MigrationChecked = false;
        private bool _NeedMigration = false;
        public bool NeedMigration
        {
            get
            {
                if (!MigrationChecked)
                {
                    var currentVersion = new Version(0, 3);
                    var versionFile = HostingEnvironment.ContentRootPath + "\\App_Data\\appversion.txt";
                    if (File.Exists(versionFile))
                    {
                        var v = new Version(File.ReadAllText(versionFile));
                        _NeedMigration = v.CompareTo(currentVersion) < 0;
                    }
                    else
                    {
                        _NeedMigration = true;
                    }
                    MigrationChecked = true;
                    if (NeedMigration)
                    {
                        File.WriteAllText(versionFile, currentVersion.ToString());
                    }
                }
                return _NeedMigration;
            }
        }

        public IApplicationLifetime ApplicationLifetime { get; set; }

        public IHostingEnvironment HostingEnvironment { get; set; }
        public Version AppVersion { get; set; }

        public void Configure(IAbpStartupConfiguration Configuration, IIocManager IocManager)
        {
            if (NeedMigration)
            {
                Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
                Configuration.ReplaceService(typeof(IEventBus), () =>
                {
                    IocManager.IocContainer.Register(
                        Component.For<IEventBus>().Instance(NullEventBus.Instance)
                    );
                });
            }
        }


        public void Run<T>(IIocManager iocManager)
            where T : IMigratorExecuter
        {
            if (NeedMigration)
            {
                using (var migrateExecuter = iocManager.ResolveAsDisposable<T>())

                {
                    migrateExecuter.Object.Run();
                }
            }
        }

    }
}
