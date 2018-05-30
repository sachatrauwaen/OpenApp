using Abp.AspNetCore.Mvc.ViewComponents;

namespace Satrabel.OpenApp.Web.Views
{
    public abstract class OpenAppViewComponent : AbpViewComponent
    {
        protected OpenAppViewComponent()
        {
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }
    }
}