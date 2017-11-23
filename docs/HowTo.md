# How to start

## The typical workflow
1. Prepare Visual Studio for OpenApp Developement
1. Create an OpenApp solution
2. Create a new OpenApp module


## How to prepare Visual Studio for OpenApp Developement
* Install plugins
    * WebPack Task Runner - https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner
    * Vue Pack 2017 - https://github.com/madskristensen/VuePack2017

* Make sure Visual Studio does not use it's own node version
    Tools > Options > Projects and Solutions > Web Package Management > Deselect $(VSINSTALLDIR)\Web\External


## Creating an OpenApp Solution

### How to create Full OpenApp Solution: an OpenApp solution where you can debug the OpenApp Core projects
1. Checkout development branch
2. Create a database named 'OpenAppDb' in your Sql Server (or give it a name of your choice)
3. Open Satrabel.OpenApp.sln Solution in root folder
4. Check (and modify if necessary) the default connectionstring in \Satrabel.Starter.Web.Spa\appsettings.json
5. Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 
6. The browser will open asking you to refresh the page. Refresh the page. 
   Instead, if the browser just closes, then run the project again. (It means you were hitting F5 instead of Ctrl+F5. No worries.)
7. Login with User name 'admin' and password '123qwe'
8. Goto Roles. Give Admin all the available permissions

### How to create Compact OpenApp solution: an OpenApp solution where use the OpenApp Core assemblies from Nuget
The OpenApp Core assemblies are available via Nuget. So there is no need to create a Full OpenApp Solution. Follow these steps to create a more Compact solution:
1. Checkout development branch
2. Create a database named 'OpenAppDb' in your Sql Server (or give it a name of your choice)
3. Goto into the /src folder and decide if you want to use the MVC or SPA approach. Keep the project of your choice and delete all the other projects.
   In the next steps we will focus on the SPA approach
4. Open Satrabel.OpenApp.sln Solution in root folder
5. Remove all projects from the Solution that are marked "unavailable"
6. Remove all project from the Satrabel.Starter.Web.Spa/Dependencies/Projects that are missing
7. Remove all project from the Satrabel.OpenApp.Tests/Dependencies/Projects that are missing
8. Add nugets ..... to Satrabel.Starter.Web.Spa/Dependencies
9. Check (and modify if necessary) the default connectionstring in \Satrabel.Starter.Web.Spa\appsettings.json
10. Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 


## Creating an OpenApp module

### How to create a module?

coming soon

### How to create a data entity?

coming soon

### How to update the database schema?
* In you AppDbContext, define a DbSet for each entity of the application.
* In Package Manager Console, type Add-Migration. Make sure that your project is the Default project (in Package Manager Console)
* In AppConsts class in your project, increment the AppVersion.
* Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 

### How to add a module page?
* in the Startup folder, look at PageNames class. Add a page there.
* in the View folder, clone the About folder and modify it to use your new pagename.
* in the Controller folder, clone the About Controller and modify it to use your new pagename.
* in NavigationProvider.cs, add a new MenuItemDefinition

## Other tips

### Tips while developing
* if you are developing in Vue, consider starting Webpack in Watch mode: Task Runner Explorer > Watch - Development




