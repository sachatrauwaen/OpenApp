using Satrabel.Starter.Web.Domain.Cms;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.Starter.Web.Application.Pages.Dto
{
    public class PageTranslationDto
    {
        [MaxLength(DomainConstants.MaxTitleLength)]
        public string Name { get; set; }

        [MaxLength(DomainConstants.MaxSlugLength)]
        public string Slug { get; set; }
    }
}