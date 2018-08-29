using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Infrastructure
{
    public static class MultiLanguageExtensions
    {
        public static TTranslation CurrentTranslation<TTranslation>(this IMultiLingualEntity<TTranslation> entity)
            where TTranslation : class, IEntityTranslation
            
        {
            if (entity.Translations != null)
            {
                var translation = entity.Translations.FirstOrDefault(pt => pt.Language == CultureInfo.CurrentUICulture.Name);
                if (translation != null)
                {
                    return translation;
                }
            }
            return null;
        }

    }
}
