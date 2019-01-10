using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Roles;
using Abp.AutoMapper;
using Satrabel.OpenApp.Authorization.Roles;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Roles.Dto
{
    [AutoMapFrom(typeof(Role)), AutoMapTo(typeof(Role))]
    public class RoleDto : EntityDto<int>
    {
        [Display(Name="RoleName")]
        [Required]
        [StringLength(AbpRoleBase.MaxNameLength)]
        [JsonSchemaExtensionData("x-ui-grid", true)]
        public string Name { get; set; }
        
        [Display(Name = "DisplayName")]
        [Required]
        [StringLength(AbpRoleBase.MaxDisplayNameLength)]
        [JsonSchemaExtensionData("x-ui-grid", true)]
        public string DisplayName { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public string NormalizedName { get; set; }
        
        [StringLength(Role.MaxDescriptionLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public string Description { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public bool IsStatic { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public List<string> Permissions { get; set; }
    }
}