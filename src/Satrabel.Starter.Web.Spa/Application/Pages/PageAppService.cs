using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Satrabel.Starter.Web.Application.Pages.Dto;
using Satrabel.Starter.Web.Domain.Cms;
using System.Linq;

namespace Satrabel.Starter.Web.Application.Pages
{
    public class PageAppService : CrudAppService<Page, PageDto, int, PagedResultRequestDto, PageDto, PageDto>
    {
        public PageAppService(IRepository<Page, int> repository) : base(repository)
        {

        }

        protected override Page GetEntityById(int id)
        {
            return Repository.GetAllIncluding(p => p.Translations).FirstOrDefault(j => j.Id == id);
        }
        protected override IQueryable<Page> CreateFilteredQuery(PagedResultRequestDto input)
        {
            var q = Repository.GetAllIncluding(p=> p.Translations);
            //if (!string.IsNullOrEmpty(input.Nom))
            //{
            //    q = q.Where(c => c.Nom.StartsWith(input.Nom));
            //}
            return q;
        }
        protected override Page MapToEntity(PageDto createInput)
        {
            return ObjectMapper.Map<Page>(createInput);
        }


    }
}
