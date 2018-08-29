using Abp.AutoMapper;
using AutoMapper;
using Satrabel.Starter.Web.Application.Pages;
using Satrabel.Starter.Web.Application.Pages.Dto;
using Satrabel.Starter.Web.Domain.Cms;

namespace Satrabel.Starter.Web.Startup
{
    internal static class CustomDtoMapper
    {
        public static void CreateMappings(IMapperConfigurationExpression configuration, MultiLingualMapContext context)
        {
            configuration.CreateMultiLingualMap<Page, PageTranslation, PageDto>(context);

            configuration.CreateMap<PageCreateDto, Page>();
            
            configuration.CreateMap<PageTranslationDto, PageTranslation>();
        }
    }
}