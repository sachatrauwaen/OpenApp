using System.Collections.Generic;
using System.Linq;

namespace Satrabel.Starter.Web.Application.Cms
{
    public class CmsAppService : MyApplicationServiceBase
    {
        private List<PageDto> _pages = new List<PageDto>();

        public CmsAppService()
        {
            var modules = new List<ModuleDto>();
            modules.Add(new ModuleDto()
            {
                Title="hello 1",
                Content="content 1",
                ViewComponent="Html",
                PaneName ="LeftPane"
            });
            modules.Add(new ModuleDto()
            {
                Title = "hello 2",
                Content = "content 2",
                ViewComponent = "OpenContent",
                PaneName = "ContentPane"
            });
            _pages.Add(new PageDto()
            {
                Id= 1,
                Name="Page 1",
                Slug="/page1",
                Modules= modules
            });
            modules = new List<ModuleDto>();
            modules.Add(new ModuleDto()
            {
                Title = "hello 3",
                Content = "content 3",
                ViewComponent = "Html",
                PaneName = "ContentPane"
            });
            modules.Add(new ModuleDto()
            {
                Title = "hello 4",
                Content = "content 4",
                ViewComponent = "Html",
                PaneName = "ContentPane"
            });
            _pages.Add(new PageDto()
            {
                Id = 2,
                Name = "Page 2",
                Slug="/page2",
                Modules=modules
            });
        }

        public PageDto GetPage(int id)
        {
            return _pages.SingleOrDefault(p=> p.Id==id);
        }
        public PageDto GetBySlug(string slug)
        {
            return _pages.SingleOrDefault(p => p.Slug == slug);
        }
    }
}