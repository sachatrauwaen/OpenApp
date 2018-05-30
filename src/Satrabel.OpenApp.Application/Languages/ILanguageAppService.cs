using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Satrabel.OpenApp.Roles.Dto;
using Satrabel.OpenApp.Users.Dto;
using Satrabel.OpenApp.Languages.Dto;

namespace Satrabel.OpenApp.Languages
{
    public interface ILanguageAppService : IAsyncCrudAppService<LanguageDto, int, PagedResultRequestDto, LanguageDto, LanguageDto>
    {
        
    }
}