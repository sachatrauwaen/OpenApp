using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Translations.Dto
{
    public class TranslationResultRequestDto: PagedResultRequestDto
    {
        [JsonSchemaExtensionData("x-rel-app", "translation")]
        [JsonSchemaExtensionData("x-rel-action", "getLanguages")]
        public int? Language { get; set; }
    }
}
