using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Satrabel.OpenApp.Web.Views
{
    public abstract class JobManagerRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected JobManagerRazorPage()
        {
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }
    }
}
