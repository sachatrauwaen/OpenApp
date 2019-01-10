using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Users.Dto
{
    public class UsersResultRequestDto : PagedAndSortedResultRequestDto
    {
        [JsonSchemaExtensionData("x-ui-filter-eager", true)]
        public string UserName { get; set; }
        [JsonSchemaExtensionData("x-ui-filter-eager", true)]
        public string Email { get; set; }
    }
}
