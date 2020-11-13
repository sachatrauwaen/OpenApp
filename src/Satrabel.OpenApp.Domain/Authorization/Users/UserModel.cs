using Satrabel.OpenApp.Render;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Authorization.Users
{
    public class UserModel: EmailModel
    {
        public string TenantName { get; set; }
        public string TenancyName { get; set; }
        public string UserFullName { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }
        public string Url { get; set; }
    }
}