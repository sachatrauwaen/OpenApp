using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Startup
{
    public interface IWebConfig
    {
        string MetaTitle { get; set; }
        string MetaDescription { get; set; }
        string LogoUrl { get; set; }
        string BodyClass { get; set; }

        string Favicon { get; set; }

        string FooterLinkUrl { get; set; }
        string FooterLinkText { get; set; }
        string FooterCopyright { get; set; }
    }
}
