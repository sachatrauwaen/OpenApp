using Abp.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.OpenApi.Models;

namespace Satrabel.OpenApp.Web.Startup
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
            var controllerPermissions = context.ApiDescription.ControllerAttributes()
                .OfType<AbpAuthorizeAttribute>()
                .Select(attr => attr.Permissions);

            var actionPermissions = context.ApiDescription.ActionAttributes()
                .OfType<AbpAuthorizeAttribute>()
                .Select(attr => attr.Permissions);

            var permissions = controllerPermissions.Union(actionPermissions).Distinct()
                .SelectMany(p => p);

            if (permissions.Any())
            {
                operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
                operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });

                operation.Security = new List<IDictionary<string, IEnumerable<string>>>
                {
                    new Dictionary<string, IEnumerable<string>>
                    {
                        { "bearerAuth", permissions }
                    }
                };
            }

            operation.Responses.Add("500", new OpenApiResponse { Description = "Server Error" });
        }
    }
}
