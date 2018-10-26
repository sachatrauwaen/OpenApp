using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Authorization.Roles;
using Abp.AutoMapper;
using Satrabel.OpenApp.Authorization.Roles;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Roles.Dto
{
    [AutoMapTo(typeof(Role))]
    public class CreateRoleDto
    {
        [Required]
        [StringLength(AbpRoleBase.MaxNameLength)]
        public string Name { get; set; }
        
        [Required]
        [StringLength(AbpRoleBase.MaxDisplayNameLength)]
        public string DisplayName { get; set; }

        public string NormalizedName { get; set; }
        
        [StringLength(Role.MaxDescriptionLength)]
        public string Description { get; set; }

        public bool IsStatic { get; set; }

        [JsonSchemaExtensionData("x-enum-action", "getAllPermissions")]
        [JsonSchemaExtensionData("x-enum-valuefield", "name")]
        [JsonSchemaExtensionData("x-enum-textfield", "displayName")]
        public List<string> Permissions { get; set; }
    }
}