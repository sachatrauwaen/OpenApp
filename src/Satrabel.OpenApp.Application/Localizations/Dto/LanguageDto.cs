using Abp.AutoMapper;
using Abp.Localization;

namespace Satrabel.OpenApp.Localizations.Dto
{
    [AutoMapFrom(typeof(ApplicationLanguage))]
    public class LanguageDto
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
    }
}