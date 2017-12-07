using Abp.Localization;
using AutoMapper;

namespace Satrabel.OpenApp.Localizations.Dto
{
    public class LocalizationMapProfile : Profile
    {
        public LocalizationMapProfile()
        {
            CreateMap<LocalizationDto, ApplicationLanguage>();
            CreateMap<ApplicationLanguage, LocalizationDto>();
        }
    }
}
