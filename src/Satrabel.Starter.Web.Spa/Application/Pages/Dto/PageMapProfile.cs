using AutoMapper;
using Satrabel.Starter.Web.Domain.Cms;
using Satrabel.Starter.Web.Infrastructure;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Application.Pages.Dto
{
    public class PageMapProfile : Profile
    {
        public PageMapProfile()
        {
            CreateMap<PageCreateDto, Page>().AfterMap((source, destination, context) =>
            {
                destination.TenantId = 1;
                PageTranslation translation;
                if (destination.Translations == null)
                {
                    destination.Translations = new List<PageTranslation>();
                    translation = new PageTranslation()
                    {
                        Core = destination,
                        Language = CultureInfo.CurrentUICulture.Name
                    };
                    destination.Translations.Add(translation);
                }
                else
                {
                    translation = destination.Translations.FirstOrDefault(pt => pt.Language == CultureInfo.CurrentUICulture.Name);
                    if (translation == null)
                    {
                        translation = new PageTranslation()
                        {
                            Core = destination,
                            Language = CultureInfo.CurrentUICulture.Name
                        };
                        destination.Translations.Add(translation);
                    }
                }
                context.Mapper.Map(source, translation);
            })
            .ForMember(dest => dest.ExtensionData, opt => opt.Ignore())
            .ForMember(dest => dest.CreationTime, opt => opt.Ignore())
            .ForMember(dest => dest.CreatorUserId, opt => opt.Ignore())
            .ForMember(dest => dest.LastModificationTime, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifierUserId, opt => opt.Ignore());

            CreateMap<PageDto, PageTranslation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Core, opt => opt.Ignore())
            .ForMember(dest => dest.CoreId, opt => opt.Ignore())
            .ForMember(dest => dest.Language, opt => opt.Ignore())
            .ForMember(dest => dest.ExtensionData, opt => opt.Ignore())
            .ForMember(dest => dest.CreationTime, opt => opt.Ignore())
            .ForMember(dest => dest.CreatorUserId, opt => opt.Ignore())
            .ForMember(dest => dest.LastModificationTime, opt => opt.Ignore())
            .ForMember(dest => dest.LastModifierUserId, opt => opt.Ignore());

           

            CreateMap<Page, PageDto>().BeforeMap((source, destination, context) =>
            {
                //if (source.Translations != null)
                //{
                //    var translation = source.Translations.FirstOrDefault(pt => pt.Language == CultureInfo.CurrentUICulture.Name);
                //    if (translation != null)
                //    {
                //        context.Mapper.Map(translation, destination);
                //    }
                //}
                var translation = source.CurrentTranslation();
                if (translation != null)
                {
                    context.Mapper.Map(translation, destination);
                }
            })
            .ForMember(dest => dest.ParentPageName, opt => opt.MapFrom(src => src.Parent != null && src.Parent.CurrentTranslation() != null ? src.Parent.CurrentTranslation().Name : ""))
            .ForMember(dest => dest.Name, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.Ignore());

            CreateMap<PageTranslation, PageDto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore());

        }
    }
}
