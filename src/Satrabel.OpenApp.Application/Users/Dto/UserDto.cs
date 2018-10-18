using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Satrabel.OpenApp.Authorization.Users;
using System.ComponentModel;
using NJsonSchema.Annotations;
using Satrabel.OpenApp.UIAttributes;

namespace Satrabel.OpenApp.Users.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserDto : EntityDto<long>
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public string UserName { get; set; }


        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        //[JsonSchemaExtensionData("x-ui-grid", false)]
        [UIGrid(false)]
        [Display(Name ="Firstname")]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        [JsonSchemaExtensionData("x-ui-grid", false)]        
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        [DataType(DataType.EmailAddress)]
        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
        public string EmailAddress { get; set; }

        [JsonSchemaExtensionData("x-ui-grid-sortable", true)]
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

        [JsonSchemaExtensionData("x-ui-grid", false)]
        public bool CanDelete
        {
            get
            {
                return UserName != "admin";
            }
        }
    }
}