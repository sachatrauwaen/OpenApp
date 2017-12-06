using Abp.Localization;
using AutoMapper;

namespace Satrabel.OpenApp.LocalizationManager.Dto
{
    public class TranslationMapProfile : Profile
    {
        public TranslationMapProfile()
        {
            CreateMap<TranslationDto, ApplicationLanguage>();
            CreateMap<ApplicationLanguage, TranslationDto>();
        }
    }
}
