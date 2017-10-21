using System.Reflection;
using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;
using Satrabel.Starter.Web;

namespace Satrabel.OpenApp.Web.Localization
{
    public static class StarterLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(Starter.Web.AppConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(StarterLocalizationConfigurer).GetAssembly(),
                        "Satrabel.Starter.Web.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}