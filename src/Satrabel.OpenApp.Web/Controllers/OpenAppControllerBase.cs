using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Satrabel.OpenApp.Controllers
{
    public abstract class OpenAppControllerBase: AbpController
    {
        protected OpenAppControllerBase()
        {
            LocalizationSourceName = OpenAppConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}