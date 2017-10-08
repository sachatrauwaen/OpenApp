using System.Threading.Tasks;
using Satrabel.OpenApp.Configuration.Dto;

namespace Satrabel.OpenApp.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}