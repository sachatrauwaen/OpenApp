using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Satrabel.OpenApp.Authorization.Users;
using System.ComponentModel;
using NJsonSchema.Annotations;
using Satrabel.OpenApp.UIAttributes;
using System.Collections.Generic;

namespace Satrabel.OpenApp.Users.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserDto : EntityDto<long>
    {

        public UserDto()
        {
            Settings = new List<SettingDto>();
        }

        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string UserName { get; set; }

        [StringLength(AbpUserBase.MaxUserNameLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Title { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        //[JsonSchemaExtensionData("x-ui-grid", false)]
        [UIGrid(false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        [Display(Name ="Firstname")]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Surname { get; set; }

       

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        [DataType(DataType.EmailAddress)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string EmailAddress { get; set; }

        [StringLength(AbpUserBase.MaxPhoneNumberLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public virtual string PhoneNumber { get; set; }

        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public bool IsActive { get; set; }

        [ReadOnly(true)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        
        public string FullName { get; set; }

        [ReadOnly(true)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public DateTime? LastLoginTime { get; set; }

        [ReadOnly(true)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public DateTime CreationTime { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public string[] RoleNames { get; set; }

        [ReadOnly(true)]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public virtual int? TenantId { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public bool CanDelete
        {
            get
            {
                return UserName != "admin";
            }
        }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        [ReadOnly(true)]
        public string[] CustomActions
        {
            get
            {
                return new []{ "userimpersonation" } ;
            }
        }

        [JsonSchemaExtensionData("x-ui-group", "Settings")]
        [JsonSchemaExtensionData("x-ui-hideLabel", true)]
        [JsonSchemaExtensionData("x-type", "settings")]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public List<SettingDto> Settings { get; set; }
    }
}