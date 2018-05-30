using Abp.Dependency;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Startup
{
    public class WebConfig : IWebConfig
    {
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        public string LogoUrl { get; set; }
        public string BodyClass { get; set; } = "header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden";
        public string FooterLinkUrl { get; set; }
        public string FooterLinkText { get; set; }
        public string FooterCopyright { get; set; }
    }
}
