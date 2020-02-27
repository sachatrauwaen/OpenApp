using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.MultiTenancy;
using NJsonSchema.Annotations;

namespace Satrabel.OpenApp.MultiTenancy.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantDto : EntityDto
    {
        public TenantDto()
        {
            Features = new List<FeatureDto>();
            Settings = new List<SettingDto>();
        }

        [Required]
        [StringLength(AbpTenantBase.MaxTenancyNameLength)]
        [RegularExpression(AbpTenantBase.TenancyNameRegex)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string TenancyName { get; set; }

        [Required]
        [StringLength(AbpTenantBase.MaxNameLength)]
        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public string Name { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "Details")]
        public bool IsActive { get; set; }

        [JsonSchemaExtensionData("x-ui-grid", false)]
        [ReadOnly(true)]
        public string[] CustomActions
        {
            get
            {
                return new[] { "tenantimpersonation" };
            }
        }

        [JsonSchemaExtensionData("x-ui-group", "Features")]
        [JsonSchemaExtensionData("x-ui-hideLabel", true)]
        [JsonSchemaExtensionData("x-type", "features")]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public List<FeatureDto> Features { get; set; }

        [JsonSchemaExtensionData("x-ui-group", "Settings")]
        [JsonSchemaExtensionData("x-ui-hideLabel", true)]        
        [JsonSchemaExtensionData("x-type", "settings")]
        [JsonSchemaExtensionData("x-ui-grid", false)]
        public List<SettingDto> Settings { get; set; }
    }
}