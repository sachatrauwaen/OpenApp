using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Satrabel.OpenApp.Authorization.Roles;
using AutoMapper;
using Abp.Localization;

namespace Satrabel.OpenApp.Languages.Dto
{
    public class LanguageMapProfile : Profile
    {
        public LanguageMapProfile()
        {
            CreateMap<LanguageDto, ApplicationLanguage>().ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src=> !src.Enabled));
            CreateMap<ApplicationLanguage, LanguageDto>().ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
        }
    }
}
