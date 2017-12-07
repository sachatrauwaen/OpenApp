using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Localization;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Localizations.Dto
{
    [AutoMapTo(typeof(ApplicationLanguageText)), AutoMapFrom(typeof(ApplicationLanguageText))]
    public class LocalizationDto 
    {
        [ReadOnly(true)]
        public string Source { get; set; }

        [ReadOnly(true)]
        public string LanguageName { get; set; }

        [Required]
        [StringLength(ApplicationLanguageText.MaxKeyLength)]
        [ReadOnly(true)]
        public string Key { get; set; }

        [ReadOnly(true)]
        public string Default { get; set; }

        [Required]
        [StringLength(ApplicationLanguageText.MaxValueLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public string Value { get; set; }
    }
}
