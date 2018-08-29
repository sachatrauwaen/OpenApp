using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;
using Satrabel.Starter.Web.Domain.Cms;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.Starter.Web.Application.Pages.Dto
{
    public class PageDto: EntityDto
    {
        [MaxLength(DomainConstants.MaxTitleLength)]
        public string Name { get; set; }

        [MaxLength(DomainConstants.MaxSlugLength)]
        public string Slug { get; set; }

        public bool IsActive { get; set; } = true;

        [Display(Name = "Parent")]
        [ReadOnly(true)]
        public string ParentPageName { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-enum-action", "getPages")]
        [JsonSchemaExtensionData("x-enum-textfield", "name")]
        [JsonSchemaExtensionData("x-enum-valuefield", "id")]
        //[JsonSchemaExtensionData("x-enum-nonelabel", "Tous")]
        [Display(Name = "Parent")]
        
        public int? ParentId { get; set; }
    }
}