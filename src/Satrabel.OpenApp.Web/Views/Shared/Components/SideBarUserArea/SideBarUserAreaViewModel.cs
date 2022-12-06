﻿using Satrabel.OpenApp.Sessions.Dto;

namespace Satrabel.OpenApp.Web.Views.Shared.Components.SideBarUserArea
{
    public class SideBarUserAreaViewModel
    {
        public GetCurrentLoginInformationsOutput LoginInformations { get; set; }

        public bool IsMultiTenancyEnabled { get; set; }

        public string GetShownLoginName()
        {
            var userName = "<span id=\"HeaderCurrentUserName\">" + LoginInformations?.User?.UserName + "</span>";

            if (!IsMultiTenancyEnabled)
            {
                return userName;
            }

            return LoginInformations.Tenant == null
                ? userName
                : LoginInformations.Tenant.TenancyName + "\\" + userName;
        }
        public string GetShownTenantName()
        {
            var tenantName = "";

            if (!IsMultiTenancyEnabled)
            {
                return tenantName;
            }

            return LoginInformations.Tenant == null
                ? tenantName
                : LoginInformations.Tenant.TenancyName + "\\" + tenantName;
        }
    }
}
