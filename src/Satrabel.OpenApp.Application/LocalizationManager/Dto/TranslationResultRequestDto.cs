using Abp.Application.Services.Dto;

namespace Satrabel.OpenApp.LocalizationManager.Dto
{
    public class TranslationResultRequestDto: PagedResultRequestDto
    {
        //[JsonSchemaExtensionData("x-rel-app", "translation")]
        //[JsonSchemaExtensionData("x-rel-action", "getLanguages")]
        public string LanguageName { get; set; }

        public bool NotTranslatedOnly { get; set; }
    }
}
