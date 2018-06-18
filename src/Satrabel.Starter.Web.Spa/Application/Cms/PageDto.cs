using Abp.Application.Services.Dto;
using System.Collections.Generic;

namespace Satrabel.Starter.Web.Application
{
    public class PageDto: EntityDto
    {
        public PageDto()
        {
            Modules = new List<ModuleDto>();
        }
        public string Name { get; set; }
        public string Slug { get; set; }

        public List<ModuleDto> Modules { get; set; }
    }
}