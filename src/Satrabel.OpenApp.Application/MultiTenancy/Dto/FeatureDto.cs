using Abp.Localization;

namespace Satrabel.OpenApp.MultiTenancy.Dto
{
    public class FeatureDto
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Value { get; set; }
        public string InputType { get; set; }
        public string Validator { get; set; }
    }
}