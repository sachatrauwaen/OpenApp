using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace Satrabel.Starter.Web.Localization
{
    public static class LocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            AddLanguageSource(localizationConfiguration, Starter.Web.AppConsts.LocalizationSourceName);
        }

        private static void AddLanguageSource(ILocalizationConfiguration localizationConfiguration, string sourcename)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(sourcename,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(LocalizationConfigurer).GetAssembly(),
                        "Satrabel.Starter.Web.Localization." + sourcename
                    )
                )
            );
        }
    }
}