using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Localization;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Satrabel.OpenApp.MultiTenancy;

namespace Satrabel.OpenApp.Translations.Dto
{
    //[AutoMapFrom(typeof(ApplicationLanguageText))]
    [AutoMapTo(typeof(ApplicationLanguageText)), AutoMapFrom(typeof(ApplicationLanguageText))]
    public class TranslationDto : EntityDto<long>
    {
        /*
        [Required]
        [StringLength(ApplicationLanguageText.MaxSourceNameLength)]
        public string Source { get; set; }
        */

        [Required]
        [StringLength(ApplicationLanguageText.MaxKeyLength)]
        public string Key { get; set; }

        [Required]
        [StringLength(ApplicationLanguageText.MaxValueLength)]
        public string Value { get; set; }

        [ReadOnly(true)]
        public string LanguageName { get; set; }

        [ReadOnly(true)]
        public string Source { get; set; }
    }
}
