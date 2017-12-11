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

* Resharper users would verify that resharper is following correct version. (options > code editing > typescript > inspections)


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
8. Open Nuget Package Manager for Solution. Add extra Package Source (top right corner), namely https://ci.appveyor.com/nuget/openapp
9. Install, from this source, the package Satrabel.OpenApp.Web
9. Check (and modify if necessary) the default connectionstring in \Satrabel.Starter.Web.Spa\appsettings.json
10. Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 


## Creating an OpenApp module

### How to create a module?

* Create a new /Application/Services/YourNewServiceClass.cs that inherits from MyApplicationServiceBase
coming soon

### How to create a CRUD page?

* Notes: 
	- CRUD pages UIs are entirely defined by DTOs (with annotations). There is no razor/xml/markup.
	- The DTOs + annotations get mapped to a JSON a sent over the wire
	- On the client side a Vue instance generates components on the page based on the JSON
	- By definining an AppService (see Abp documentation) a controller gets generated and its methods automatically mapped to and generated in javascript calls (used by the Vue instance)

1. Create an AppService and inherit from AsyncCrudAppService
	1.1 Give it a name, e.g. 'UserAppService'. Names are important because the code generation is often convention-driven.
	1.2 While creating the service, declare the DTOs it depends on for reading, creating, updating, etc. in its class definition. To start they can all rely on the same DTO. (if you only want to update specific fields etc, you'll need to create separate dtos)
	1.3 Create a constructor
	1.4 That's it. No need to override any methods, unless your page requires custom behavior on CRUD actions.
2. Create the DTO
	2.1 Give it the same name you declared while building the AppService definition, e.g. if your AppService is called 'UserAppService' then name your DTO 'UserDto'
	2.2 Provide the fields you want to be shown, these should be the same as your database entity. If they are not, you will have to add a mapping yourself. (look up how in the documentation)
	2.3 Optionally, add annotations. These can define wether fields belong to a certain tab, have validation requirements, ... or the type of input (checkbox, textfield, etc) See existing classes for examples (NOT PART OF APB, NOT IN THE DOCUMENTATION!)
3. Add the page to the menu
	3.1 in NavigationProvider.cs, add a new MenuItemDefinition
4. Todo: How to add filters
5. Todo: Document the available annotations/components?

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




