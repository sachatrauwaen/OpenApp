using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Satrabel.OpenApp.MultiTenancy;

namespace Satrabel.OpenApp.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}