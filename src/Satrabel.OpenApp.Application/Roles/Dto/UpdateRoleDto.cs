using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;
using Satrabel.OpenApp.Authorization.Roles;

using Abp.Authorization.Roles;
using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Roles.Dto
{
    [AutoMapTo(typeof(Role))]
    public class UpdateRoleDto : EntityDto<int>
    {
        [Required]
        [StringLength(AbpRoleBase.MaxNameLength)]
        [JsonSchemaExtensionData("x-ui-group", "RoleDetails")]
        public string Name { get; set; }
        
        [Required]
        [StringLength(AbpRoleBase.MaxDisplayNameLength)]
        [JsonSchemaExtensionData("x-ui-group", "RoleDetails")]
        public string DisplayName { get; set; }

        [StringLength(Role.MaxDescriptionLength)]
        [JsonSchemaExtensionData("x-ui-group", "RoleDetails")]
        public string Description { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "RoleDetails")]
        public bool IsDefault { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "RolePermissions")]
        [JsonSchemaExtensionData("x-enum-action", "getAllPermissions")]
        [JsonSchemaExtensionData("x-enum-valuefield", "name")]
        [JsonSchemaExtensionData("x-enum-textfield", "displayName")]
        public List<string> Permissions { get; set; }
    }
}