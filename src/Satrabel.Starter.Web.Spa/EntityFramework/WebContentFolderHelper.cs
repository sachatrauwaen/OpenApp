using System;
using System.IO;
using System.Linq;
using Abp.Reflection.Extensions;
using Satrabel.OpenApp;
using Satrabel.Starter.Web.Startup;

namespace Satrabel.Starter.Web
{
    /// <summary>
    /// This class is used to find root path of the web project in;
    /// unit tests (to find views) and entity framework core command line commands (to find conn string).
    /// </summary>
    public static class WebContentDirectoryFinder
    {
        public static string CalculateContentRootFolder()
        {
            return Satrabel.OpenApp.Web.WebContentDirectoryFinder.CalculateContentRootFolder(typeof(WebMvcModule));
        }
    }
}
