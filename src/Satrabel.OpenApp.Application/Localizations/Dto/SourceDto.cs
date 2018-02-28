using Abp.AutoMapper;
using Abp.Localization.Sources;

namespace Satrabel.OpenApp.Localizations.Dto
{
    [AutoMapFrom(typeof(ILocalizationSource))]
    public class SourceDto
    {
        public string Name { get; set; }
    }
}