using Abp.Application.Navigation;
using Abp.Localization;
using Satrabel.OpenApp.Authorization;

namespace Satrabel.OpenApp.Web.Startup
{
    /// <summary>
    /// This class defines menus for the application.
    /// </summary>
    public class OpenAppNavigationProvider : NavigationProvider
    {
        public override void SetNavigation(INavigationProviderContext context)
        {
            context.Manager.MainMenu
                .AddItem(new MenuItemDefinition(
                        "Admin",
                        L("Admin"),
                        icon: "menu"
                        ).AddItem(
                        new MenuItemDefinition(
                            PageNames.Tenants,
                            L("Tenants"),
                            url: "/Crud#app/tenant",
                            icon: "layers",
                            requiredPermissionName: PermissionNames.Pages_Tenants
                        )
                    ).AddItem(
                        new MenuItemDefinition(
                            PageNames.Users,
                            L("Users"),
                            url: "/Crud#app/user",
                            icon: "people",
                            requiredPermissionName: PermissionNames.Pages_Users
                        )
                    ).AddItem(
                        new MenuItemDefinition(
                            PageNames.Roles,
                            L("Roles"),
                            url: "Crud#/app/role",
                            icon: "shield",
                            requiredPermissionName: PermissionNames.Pages_Roles
                        )
                    )
                );
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, OpenAppConsts.LocalizationSourceName);
        }
    }
}
