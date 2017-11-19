## How to start
* Checkout development branch
* Open Satrabel.OpenApp.sln Solution in root folder
* Create a database named OpenAppDb in your Sql Server
* Check (and modify if necessary) the default connectionstring in \Satrabel.Starter.Web.Spa\appsettings.json 
* Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 
* The browser will open asking you to refresh the page. Refresh the page.
*    Instead, if the browser just closes, then run the project again. (It means you were hitting F5 instead of Ctrl+F5. No worries.)
* Login with User name 'admin' and password '123qwe'
* Goto Roles. Give Admin all the available permissions


## How to organize Visual Studio
* Install plugins
	* WebPack Task Runner - https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner
	* Vue Pack 2017 - https://github.com/madskristensen/VuePack2017

* Make sure Visual Studio does not use it's own node version
    Tools > Options > Projects and Solutions > Web Package Management > Deselect $(VSINSTALLDIR)\Web\External


## Tips while developing
* if you are developing in Vue, consider starting Webpack in Watch mode: Task Runner Explorer > Watch - Development


## How to update database schema?
* In you AppDbContext, define a DbSet for each entity of the application.
* In Package Manager Console, type Add-Migration. Make sure that your project is the Default project (in Package Manager Console)
* In AppConsts class in your project, increment the AppVersion.
* Run the solution using Ctrl+F5 with Satrabel.Starter.Web.Spa as startup project 


## How to add a page?
* in the Startup folder, look at PageNames class. Add a page there.
* in the View folder, clone the About folder and modify it to use your new pagename.
* in the Controller folder, clone the About Controller and modify it to use your new pagename.
* in NavigationProvider.cs, add a new MenuItemDefinition

