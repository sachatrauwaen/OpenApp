using Abp.AspNetCore.Mvc.ViewComponents;

namespace Satrabel.OpenApp.Web.Views
{
    public abstract class JobManagerViewComponent : AbpViewComponent
    {
        protected JobManagerViewComponent()
        {
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }
    }
}