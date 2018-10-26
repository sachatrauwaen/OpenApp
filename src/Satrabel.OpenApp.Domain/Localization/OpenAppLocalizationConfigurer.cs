using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace Satrabel.OpenApp.Localization
{
    public static class OpenAppLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(OpenAppConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(OpenAppLocalizationConfigurer).GetAssembly(),
                        "Satrabel.OpenApp.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}