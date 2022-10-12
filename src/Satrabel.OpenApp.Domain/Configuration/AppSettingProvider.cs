﻿using System.Collections.Generic;
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
                new SettingDefinition(AppSettingNames.ClientRootAddress, "", scopes: SettingScopes.Application | SettingScopes.Tenant , isVisibleToClients: true),
                new SettingDefinition(AppSettingNames.UiTheme, "red", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User, isVisibleToClients: true),
                new SettingDefinition(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin, "false", scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User),
                new SettingDefinition(AppSettingNames.AllowRegistrationForHostUsers, "false", scopes: SettingScopes.Application),
            };
        }
    }
}
