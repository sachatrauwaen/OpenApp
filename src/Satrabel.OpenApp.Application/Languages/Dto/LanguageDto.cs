using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Localization;
using NJsonSchema.Annotations;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.OpenApp.Languages.Dto
{
    [AutoMapFrom(typeof(ApplicationLanguage))]
    public class LanguageDto : EntityDto<int>
    {
        [Required]
        [Display(Name = "Code")]
        [StringLength(ApplicationLanguage.MaxNameLength)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public string Name { get; set; }

        [Required]
        [StringLength(ApplicationLanguage.MaxDisplayNameLength)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public string DisplayName { get; set; }

        [StringLength(ApplicationLanguage.MaxIconLength)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public string Icon { get; set; }

        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public bool Enabled { get; set; }

        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public bool Default { get; set; }
    }
}
