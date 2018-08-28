using Abp.Application.Services.Dto;

namespace Satrabel.Starter.Web.Application.Pages.Dto
{
    public class PageCreateDto : EntityDto
    {
        public bool IsActive { get; set; } = true;
    }
}