using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;
using Abp.MultiTenancy;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.MultiTenancy.Dto
{
    [AutoMapTo(typeof(Tenant))]
    public class EditTenantDto
    {
        [Required]
        [StringLength(AbpTenantBase.MaxTenancyNameLength)]
        [RegularExpression(Tenant.TenancyNameRegex)]
        public string TenancyName { get; set; }

        [Required]
        [StringLength(Tenant.MaxNameLength)]
        public string Name { get; set; }

        public bool IsActive { get; set; }

        [JsonSchemaExtensionData("x-type", "object")]
        public Dictionary<string, string> Features { get; set; }

        [JsonSchemaExtensionData("x-type", "settings")]
        public List<SettingDto> Settings { get; set; }

    }
}