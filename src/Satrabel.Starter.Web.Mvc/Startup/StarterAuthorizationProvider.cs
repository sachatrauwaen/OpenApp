using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;
using Satrabel.OpenApp;

namespace Satrabel.Starter.Authorization
{
    public class StarterAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Home, L("Home"));
            context.CreatePermission(PermissionNames.Pages_About, L("About"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, OpenAppConsts.LocalizationSourceName);
        }
    }
}
