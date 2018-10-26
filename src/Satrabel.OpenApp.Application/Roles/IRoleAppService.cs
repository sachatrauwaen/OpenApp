using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Satrabel.OpenApp.Roles.Dto;

namespace Satrabel.OpenApp.Roles
{
    public interface IRoleAppService : IAsyncCrudAppService<RoleDto, int, PagedResultRequestDto, CreateRoleDto, UpdateRoleDto>
    {
        Task<ListResultDto<PermissionDto>> GetAllPermissions();

        Task<GetRoleForEditOutput> GetRoleForEdit(EntityDto input);

        Task<ListResultDto<RoleListDto>> GetRolesAsync(GetRolesInput input);
    }
}
