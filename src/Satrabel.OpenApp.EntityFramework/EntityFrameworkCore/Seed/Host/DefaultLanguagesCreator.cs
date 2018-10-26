using System.Collections.Generic;
using System.Linq;
using Abp.Localization;
using Microsoft.EntityFrameworkCore;

namespace Satrabel.OpenApp.EntityFramework.Seed.Host
{
    public class DefaultLanguagesCreator<TSelf>
        where TSelf : OpenAppDbContext<TSelf>
    {
        public static List<ApplicationLanguage> InitialLanguages => GetInitialLanguages();

        private readonly OpenAppDbContext<TSelf> _context;

        private static List<ApplicationLanguage> GetInitialLanguages()
        {
            return new List<ApplicationLanguage>
            {
                new ApplicationLanguage(null, "en", "English", "famfamfam-flags gb"),
                new ApplicationLanguage(null, "de", "German", "famfamfam-flags de"),
                new ApplicationLanguage(null, "fr", "Français", "famfamfam-flags fr"),
                new ApplicationLanguage(null, "nl", "Nederlands", "famfamfam-flags nl")
            };
        }

        public DefaultLanguagesCreator(OpenAppDbContext<TSelf> context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateLanguages();
        }

        private void CreateLanguages()
        {
            foreach (var language in InitialLanguages)
            {
                AddLanguageIfNotExists(language);
            }
        }

        private void AddLanguageIfNotExists(ApplicationLanguage language)
        {
            if (_context.Languages.IgnoreQueryFilters().Any(l => l.TenantId == language.TenantId && l.Name == language.Name))
            {
                return;
            }

            _context.Languages.Add(language);
            _context.SaveChanges();
        }
    }
}