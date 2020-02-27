using Abp.Application.Features;
using Abp.Localization;
using Abp.Runtime.Validation;
using Abp.UI.Inputs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Startup
{
    public class AppFeatureProvider : FeatureProvider
    {
        public override void SetFeatures(IFeatureDefinitionContext context)
        {
            context.Create("MonthPageLimit", "100", L("MonthPageLimit"), null, FeatureScopes.Tenant,
                    new SingleLineStringInputType(new NumericValueValidator(1, 1000000))
                );
        }
        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, AppConsts.LocalizationSourceName);
        }
    }
}
