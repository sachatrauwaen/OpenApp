using Abp.Application.Services.Dto;
using Satrabel.Starter.Web.Domain.Cms;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.Starter.Web.Application.Pages
{
    public class PageDto: EntityDto
    {
        [MaxLength(DomainConstants.MaxTitleLength)]
        public string Name { get; set; }

        [MaxLength(DomainConstants.MaxSlugLength)]
        public string Slug { get; set; }

        public bool IsActive { get; set; } = true;
    }
}