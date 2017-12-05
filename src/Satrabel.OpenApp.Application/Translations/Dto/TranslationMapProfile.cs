using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Satrabel.OpenApp.Authorization.Roles;
using AutoMapper;
using Abp.Localization;

namespace Satrabel.OpenApp.Translations.Dto
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
