using Abp.AutoMapper;
using Satrabel.OpenApp.Sessions.Dto;

namespace Satrabel.OpenApp.Web.Views.Shared.Components.TenantChange
{
    [AutoMapFrom(typeof(GetCurrentLoginInformationsOutput))]
    public class TenantChangeViewModel
    {
        public TenantLoginInfoDto Tenant { get; set; }
    }
}