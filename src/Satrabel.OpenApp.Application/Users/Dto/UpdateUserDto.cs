using System.ComponentModel.DataAnnotations;
using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Abp.Runtime.Validation;
using Satrabel.OpenApp.Authorization.Users;
using Abp.Application.Services.Dto;
using NJsonSchema.Annotations;
using System.Collections.Generic;

namespace Satrabel.OpenApp.Users.Dto
{
    [AutoMapTo(typeof(User))]
    public class UpdateUserDto : EntityDto<long>, IShouldNormalize
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string UserName { get; set; }

        [StringLength(AbpUserBase.MaxUserNameLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Title { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        [Display(Name = "Firstname")]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Surname { get; set; }    

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string EmailAddress { get; set; }

        [StringLength(AbpUserBase.MaxPhoneNumberLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public virtual string PhoneNumber { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public bool IsActive { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public bool IsEmailConfirmed { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public bool IsTwoFactorEnabled { get; set; }

        [Display(Name = "Roles", Description = "Role names")]
        [JsonSchemaExtensionData("x-enum-action", "getRoles")]
        [JsonSchemaExtensionData("x-enum-valuefield", "normalizedName")]
        [JsonSchemaExtensionData("x-enum-textfield", "displayName")]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string[] RoleNames { get; set; }

        
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        [DisableAuditing]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Password { get; set; }

        public void Normalize()
        {
            if (RoleNames == null)
            {
                RoleNames = new string[0];
            }
        }

        [JsonSchemaExtensionData("x-ui-group", "Settings")]
        [JsonSchemaExtensionData("x-ui-hideLabel", true)]
        [JsonSchemaExtensionData("x-type", "settings")]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public List<SettingDto> Settings { get; set; }

    }
}