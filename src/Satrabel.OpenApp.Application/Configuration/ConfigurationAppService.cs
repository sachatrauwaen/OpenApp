using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Satrabel.OpenApp.Configuration.Dto;

namespace Satrabel.OpenApp.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : OpenAppAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
