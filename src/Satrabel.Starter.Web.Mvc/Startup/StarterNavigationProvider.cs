﻿using Abp.Application.Navigation;
using Abp.Localization;
using Satrabel.OpenApp;
using Satrabel.Starter.Authorization;

namespace Satrabel.Starter.Web.Startup
{
    /// <summary>
    /// This class defines menus for the application.
    /// </summary>
    public class StarterNavigationProvider : NavigationProvider
    {
        public override void SetNavigation(INavigationProviderContext context)
        {
            context.Manager.MainMenu
                 .AddItem(
                    new MenuItemDefinition(
                        PageNames.Home,
                        L("HomePage"),
                        url: "",
                        icon: "home",
                        requiredPermissionName: PermissionNames.Pages_Home
                    )
                )
                .AddItem(
                    new MenuItemDefinition(
                        PageNames.Home,
                        L("About"),
                        url: "/About",
                        icon: "question",
                        requiredPermissionName: PermissionNames.Pages_About
                    )



                );
            context.Manager.MainMenu.Items.MoveMenuItemToBottom("Admin");
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, OpenAppConsts.LocalizationSourceName);
        }
    }
}
