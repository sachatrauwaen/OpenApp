using System;

namespace Satrabel.Starter.Web
{
    public class AppConsts
    {
        public static readonly Version AppVersion = new Version(1,0);

        public const string LocalizationSourceName = "App";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;
    }
}