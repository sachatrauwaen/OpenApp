using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace Satrabel.OpenApp.Web.Views
{
    public abstract class OpenAppRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected OpenAppRazorPage()
        {
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }
    }
}
