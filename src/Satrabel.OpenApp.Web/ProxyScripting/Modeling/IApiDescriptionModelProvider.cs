using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.ProxyScripting.Modeling
{
    public interface IApiDescriptionModelProvider
    {
        Abp.Web.Api.Modeling.ApplicationApiDescriptionModel CreateModel();
    }
}
