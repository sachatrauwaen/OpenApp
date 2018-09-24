using System.Threading.Tasks;
using Abp.Application.Navigation;
using Microsoft.AspNetCore.Mvc;
using Satrabel.OpenApp.Users;
using Satrabel.OpenApp.Users.Dto;
using Satrabel.OpenApp.Web.Views;

namespace Satrabel.Starter.Web.Views.Shared.Components.Users
{
    public class UsersViewComponent : OpenAppViewComponent
    {
        private readonly IUserAppService _repository;
        public UsersViewComponent(IUserAppService repository)
        {
            _repository = repository;
        }

        public async Task<IViewComponentResult> InvokeAsync(UserMenuItem menuItem)
        {
            var res = await _repository.GetAll(new UsersResultRequestDto()
            {
                MaxResultCount =1,
                SkipCount = 0
            });
            var model = new UsersViewModel
            {
                MenuItem = menuItem,
                Count = res.TotalCount
            };
            return View(model);
        }
    }
}
