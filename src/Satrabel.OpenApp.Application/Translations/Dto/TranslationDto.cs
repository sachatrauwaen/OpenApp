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
    public class TranslationDto : EntityDto<string>
    {
        /*
        [Required]
        [StringLength(ApplicationLanguageText.MaxSourceNameLength)]
        public string Source { get; set; }
        */
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
        public string Value { get; set; }

        

       
    }
}
