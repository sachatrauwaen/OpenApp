using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Satrabel.OpenApp.MultiTenancy.Dto;

namespace Satrabel.OpenApp.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, TenantFilterDto, CreateTenantDto, TenantDto>
    {
    }
}
