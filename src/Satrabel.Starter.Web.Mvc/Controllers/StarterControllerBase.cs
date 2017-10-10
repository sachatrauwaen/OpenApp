using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Satrabel.Starter.Web.Controllers
{
    public abstract class StarterControllerBase: AbpController
    {
        protected StarterControllerBase()
        {
            LocalizationSourceName = StarterConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}