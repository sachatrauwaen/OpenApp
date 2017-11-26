using System.Threading.Tasks;
using Abp.Configuration.Startup;
using Microsoft.AspNetCore.Mvc;
using Satrabel.OpenApp.Authorization;
using Abp.Application.Navigation;
using Abp.Runtime.Session;

namespace Satrabel.OpenApp.Web.Views.Shared.Components.TopBarArea
{
    public class TopBarAreaViewComponent : OpenAppViewComponent
    {
        private readonly IUserNavigationManager _userNavigationManager;
        private readonly IAbpSession _abpSession;

        public TopBarAreaViewComponent(IUserNavigationManager userNavigationManager,
            IAbpSession abpSession)
        {
            _userNavigationManager = userNavigationManager;
            _abpSession = abpSession;
        }

        public async Task<IViewComponentResult> InvokeAsync(string activeMenu = "")
        {
            var model = new TopBarAreaViewModel
            {
                MainMenu = await _userNavigationManager.GetMenuAsync("TopMenu", _abpSession.ToUserIdentifier()),
                ActiveMenuItemName = activeMenu
            };

            return View(model);
        }
    }
}
