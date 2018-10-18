using System.ComponentModel.DataAnnotations;
using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
using Satrabel.OpenApp.Authorization.Users;
using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.Users.Dto
{
    [AutoMapTo(typeof(User))]
    public class UpdateUserDto : EntityDto<long>, IShouldNormalize
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        [Display(Name = "Firstname")]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        public bool IsActive { get; set; }

        [Display(Name = "Roles", Description = "Role names")]
        [JsonSchemaExtensionData("x-enum-action", "getRoles")]
        [JsonSchemaExtensionData("x-enum-valuefield", "normalizedName")]
        [JsonSchemaExtensionData("x-enum-textfield", "displayName")]
        public string[] RoleNames { get; set; }

        
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        [DisableAuditing]
        public string Password { get; set; }

        public void Normalize()
        {
            if (RoleNames == null)
            {
                RoleNames = new string[0];
            }
        }
    }
}