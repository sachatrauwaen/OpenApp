run bat file with admin rights (open PowerShell in admin mode Ctrl+F+A)
Bat file Generates typescript sdk of the Swagger.json definition.
Input : see url in service.config.nswag                               eg "url": "http://localhost:4200/swagger/v1/swagger.json",
Output: see "output" field in service.config.nswag > Codegenerators   eg "output": "../ClientApps/_Shared/Api/service-proxies.ts",

Changes in C#, made with Edit & Continue, will not be detected by this tool. So you need to restart the website in that case.

note: the hub-service-proxies.ts, which is for SignalR, is made manually (?)