using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Satrabel.OpenApp.Roles.Dto;
using Satrabel.OpenApp.Users.Dto;

namespace Satrabel.OpenApp.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, UsersResultRequestDto, CreateUserDto, UpdateUserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();
    }
}