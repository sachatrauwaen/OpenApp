using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Localizations.Dto
{
    public class LocalizationResultRequestDto: PagedResultRequestDto
    {
        [JsonSchemaExtensionData("x-enum-action", "getSources")]
        [JsonSchemaExtensionData("x-enum-valuefield", "name")]
        [JsonSchemaExtensionData("x-enum-textfield", "name")]
        [JsonSchemaExtensionData("x-enum-nonelabel", "All")]
        public string LanguageSource { get; set; }

        [JsonSchemaExtensionData("x-enum-action", "getLanguages")]
        [JsonSchemaExtensionData("x-enum-valuefield", "name")]
        [JsonSchemaExtensionData("x-enum-textfield", "displayName")]
        [JsonSchemaExtensionData("x-enum-nonelabel", "All")]
        public string LanguageName { get; set; }

        public string LanguageKey { get; set; }

        public bool NotTranslatedOnly { get; set; }

    }
}
