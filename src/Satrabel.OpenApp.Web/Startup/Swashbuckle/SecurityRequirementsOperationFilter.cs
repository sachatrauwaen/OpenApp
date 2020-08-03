using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Abp.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Satrabel.OpenApp.Startup.Swashbuckle
{
    public class SecurityRequirementsOperationFilter : IOperationFilter
    {
        private readonly IOptions<AuthorizationOptions> authorizationOptions;

        public SecurityRequirementsOperationFilter(IOptions<AuthorizationOptions> authorizationOptions)
        {
            this.authorizationOptions = authorizationOptions;
        }

        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            //var controllerPermissions = context.ApiDescription.ControllerAttributes() //https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/826#issuecomment-416014018
            var controllerPermissions = context.MethodInfo.DeclaringType.GetTypeInfo().GetCustomAttributes(true)
                .OfType<AbpAuthorizeAttribute>()
                .Select(attr => attr.Permissions);

            //var actionPermissions = context.ApiDescription.ActionAttributes() //https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/759#issuecomment-396739121
            //var actionPermissions = context.ApiDescription.ActionAttributes()
            //    .OfType<AbpAuthorizeAttribute>()
            //    .Select(attr => attr.Permissions);

            //Debugger.Break(); // try to figure out what we need here?! //https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/759#issuecomment-396739121
            //var actionPermissions = context.MethodInfo.DeclaringType.GetTypeInfo().GetCustomAttributes(true)
            //    .OfType<AbpAuthorizeAttribute>()
            //    .Select(attr => attr.Permissions);

            //var permissions = controllerPermissions.Union(actionPermissions).Distinct().SelectMany(p => p);
            var permissions = controllerPermissions.Distinct().SelectMany(p => p);

            if (permissions.Any())
            {
                operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
                operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });

                //upgrade inspired by see https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/master/test/WebSites/OAuth2Integration/ResourceServer/Swagger/SecurityRequirementsOperationFilter.cs
                var oAuthScheme = new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
                };

                operation.Security = new List<OpenApiSecurityRequirement>
                {
                    new OpenApiSecurityRequirement
                    {
                        [ oAuthScheme ] = permissions.ToList()
                        
                    }
                };
            }

            operation.Responses.Add("500", new OpenApiResponse { Description = "Server Error" });
        }
    }
}
