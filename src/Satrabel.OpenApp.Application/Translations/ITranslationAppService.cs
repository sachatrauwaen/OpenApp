using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Satrabel.OpenApp.Translations.Dto;

namespace Satrabel.OpenApp.Translations
{
    public interface ITranslationAppService : IAsyncCrudAppService<TranslationDto, long, TranslationResultRequestDto, TranslationDto, TranslationDto>
    {
        
    }
}