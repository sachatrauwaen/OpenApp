using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Users.Dto
{
    public class UsersResultRequestDto: PagedResultRequestDto
    {
        [JsonSchemaExtensionData("x-ui-filter-eager", true)]
        public string UserName { get; set; }
        [JsonSchemaExtensionData("x-ui-filter-eager", true)]
        public string Email { get; set; }
    }
}
