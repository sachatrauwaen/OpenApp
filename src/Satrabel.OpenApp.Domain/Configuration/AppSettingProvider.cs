using System.Collections.Generic;
using Abp.Configuration;
using Abp.Zero.Configuration;

namespace Satrabel.OpenApp.Configuration
{
    /// <summary>
    /// Defines settings for the application.
    /// See <see cref="AppSettings"/> for setting names.
    /// </summary>
    public class AppSettingProvider : SettingProvider
    {
        public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
        {
            return new[]
            {
                new SettingDefinition(AppSettingNames.UiTheme, "red", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User, isVisibleToClients: true),
                new SettingDefinition(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin, "true", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User)
            };
        }
    }
}
