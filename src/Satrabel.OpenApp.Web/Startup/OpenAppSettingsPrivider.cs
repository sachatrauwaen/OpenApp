using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;

namespace Satrabel.OpenApp.Startup
{
    public class OpenAppSettingsPrivider : Abp.Configuration.SettingProvider
    {
        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            return new[]
            {
                new SettingDefinition(
                    OpenAppSettingNames.IsTenancySelectionAllowed,
                    "True",
                    scopes: SettingScopes.Application
                ),
                new SettingDefinition(
                    OpenAppSettingNames.IsUserNameEqualEmail,
                    "False",
                    scopes: SettingScopes.Application
                ),
                new SettingDefinition(
                    OpenAppSettingNames.TenantLogo,
                    "",
                    scopes: SettingScopes.Tenant
                ),
                new SettingDefinition(
                    OpenAppSettingNames.TenantDescription,
                    "",
                    scopes: SettingScopes.Tenant
                )
            };
        }
    }
}

