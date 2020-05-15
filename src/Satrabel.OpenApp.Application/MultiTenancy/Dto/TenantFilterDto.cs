using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.MultiTenancy.Dto
{
    public class TenantFilterDto : PagedAndSortedResultRequestDto
    {
        [JsonSchemaExtensionData("x-ui-filter-eager", true)]
        public string Name { get; set; }
        
    }
}
