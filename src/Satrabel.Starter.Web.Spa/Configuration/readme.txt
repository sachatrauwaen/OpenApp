This folder should not be added to git.
Except this file and appsettings.dummy.json that can be used as an example.

In this folder you can add appsettings.<machineName>.json files 
with specific config settings that will override the main appsettings.json


AppSecrets
----------

Info (See section Secret Manager): https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=visual-studio
Add a dependency (through Nuget) to the packages:
 - Microsoft.Extensions.Configuration.UserSecrets
 - Microsoft.Extensions.SecretManager.Tools

To add a secret, right click on the project in the solution explorer and click on 'Manage User Secrets'.

To access a secret in your project's code:
   --------------------------------------------------------------------------------------------------------------------------------
   var configuration = AppConfigurations.Get(typeof(<Type-of-a-class-in-your-assembly>).Assembly, null, true);
   var mySecret = configuration["mySecret"];
   --------------------------------------------------------------------------------------------------------------------------------

Using the name of the class that holds this code will definitely work as the type. Either way, just make sure to have a reference to your current assembly, so we go find the secrets in the right place.
