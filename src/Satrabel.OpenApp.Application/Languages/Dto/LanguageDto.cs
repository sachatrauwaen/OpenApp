using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Localization;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.OpenApp.Languages.Dto
{
    [AutoMapFrom(typeof(ApplicationLanguage))]
    public class LanguageDto : EntityDto<int>
    {
        [Required]
        [StringLength(ApplicationLanguage.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(ApplicationLanguage.MaxDisplayNameLength)]
        public string DisplayName { get; set; }

        [StringLength(ApplicationLanguage.MaxIconLength)]
        public string Icon { get; set; }

        public bool Enabled { get; set; }

        public bool Default { get; set; }
    }
}
