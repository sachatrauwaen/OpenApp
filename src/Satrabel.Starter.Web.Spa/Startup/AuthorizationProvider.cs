using Abp.Authorization;
using Abp.Localization;

namespace Satrabel.Starter.Web.Authorization
{
    public class AuthorizationProvider : Abp.Authorization.AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Home, L("Home"));
            context.CreatePermission(PermissionNames.Pages_About, L("About"));
            context.CreatePermission(PermissionNames.Pages_Admin, L("Admin"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AppConsts.LocalizationSourceName);
        }
    }
}
