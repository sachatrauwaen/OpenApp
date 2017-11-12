using System.Threading.Tasks;
using Abp.Application.Services;
using Satrabel.OpenApp.Sessions.Dto;

namespace Satrabel.OpenApp.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
