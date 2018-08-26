using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.ProxyScripting
{
    public interface IApiProxyScriptManager
    {
        string GetScript(Abp.Web.Api.ProxyScripting.ApiProxyGenerationOptions options);
    }
}
