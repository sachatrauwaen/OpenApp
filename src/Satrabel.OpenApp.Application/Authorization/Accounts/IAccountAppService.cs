using System.Threading.Tasks;
using Abp.Application.Services;
using Satrabel.OpenApp.Authorization.Accounts.Dto;

namespace Satrabel.OpenApp.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
