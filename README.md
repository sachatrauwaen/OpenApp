# OpenApp  - Alpha

The Goal is to Create a base framework for creating web applcations. 

It will be composed of a number of other open source prjects :

### 1. Asp.Net Boilerplate 3 [https://aspnetboilerplate.com/]
* Layered Architecture
* Modular Design
* Domain Driven Design
* Well Documented
* Multi Tenancy
* User and role management

### 2. CoreUI [http://coreui.io/]
* Bootstrap 4 Admin Template

### 3. Vuejs 2 [https://vuejs.org/]
* Progressive JavaScript Framework
* Approachable
* Versatile
* Performant

### 4. Element UI library [http://element.eleme.io]
* Vuejs 2 based component library

We started from Asp.Net Boilerplate 3 with dotnetcore, entity framework core, sql server, mvc.

We replaced the BSB Admin with the CoreUI Admin Template.

We rewrote the UI of User management, Role Management and Tenant Management with a generic autogenerated ui based on the Application service layer of Asp.net Boilerplate enhanced with some annotations on the DTOs.

This autogenerated UI framework, included in OpenApp, is made with vuejs and uses the javascript proxies generated by Abp and Json schemas generated for the Application services and DTOs. This UI framework let you also rapidely create custom crud UIs for your entities.

Based on the Asp.net Boilerplate standard template, we created standard reusable modules for most of web applications including user, role and tenant managment that are available as nuget packages. We created also a Mvc Starter Project and a Spa Starter Project to quickly start a new application development.

This way the reusable part of the Abp template are isolated and maintained centrally in this OpenApp Project.

![screenshot](https://raw.githubusercontent.com/sachatrauwaen/OpenApp/develop/screenshot-openapp.JPG)


## See also
* [How to start](docs/HowTo.md)


## Roadmap
Version 1.0.0
- [x] Language selector
- [x] Login UI fixes
- [x] Register UI

Version 1.1
- [x] Languages UI

Version 1.2
- [ ] Audit logs UI
- [ ] Reset password
- [ ] Settings UI (Email settings,...)
