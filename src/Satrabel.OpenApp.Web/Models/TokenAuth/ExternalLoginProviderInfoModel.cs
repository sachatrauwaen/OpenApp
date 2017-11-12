using Abp.AutoMapper;
using Satrabel.OpenApp.Authentication.External;

namespace Satrabel.OpenApp.Models.TokenAuth
{
    [AutoMapFrom(typeof(ExternalLoginProviderInfo))]
    public class ExternalLoginProviderInfoModel
    {
        public string Name { get; set; }

        public string ClientId { get; set; }
    }
}
