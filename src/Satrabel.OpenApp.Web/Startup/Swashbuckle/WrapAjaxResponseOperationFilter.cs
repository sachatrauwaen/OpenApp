using System.Diagnostics;
using System.Linq;
using Abp.Web.Models;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Satrabel.OpenApp.Startup.Swashbuckle
{
    public class WrapAjaxResponseOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            /*
             * By default ABP wraps API responses with an AjaxResponse class, which contains extra properties about the call like error messages, etc.
             * 
             * Since this wrapping is not defined on the API but performed by ABP at runtime, Swagger is unable to pick them up.
             * Because of this code generation (targeting, for example, a TypeScript SDK) fails since it expects the a different JSON format but receives the wrapped format.
             * 
             * This piece of code fixes that by wrapping everything in an AjaxResponse while generating the Swagger API.
             * 
             * Implementation inspired by: https://stackoverflow.com/questions/46817207/how-to-return-generic-types-on-producesresponsetype-swagger
             */

            // TODO
            // 1. check that AjaxResponse wrapping is not disabled application-wide
            // 2. Check that the DontWrap attribute is not on this method/class

            context.ApiDescription.SupportedResponseTypes
                .Where(x => x.StatusCode == 200 || x.StatusCode == 500)
                .ToList()
                .ForEach(response =>
                {
                    // Wrap the type with AjaxResponse<GenericType> so we get AjaxResponse<SpecificType>
                    var wrappedType = response.Type == typeof(void) ? typeof(AjaxResponse) : typeof(AjaxResponse<>).MakeGenericType(response.Type);
                    var wrappedTypeFriendlyId = wrappedType.FriendlyId();

                    // Add AjaxResponse<SpecificType> schema manually (since it will not be picked up by ApiDefinition/Swashbuckle)
                    if (!context.SchemaRepository.Schemas.TryGetValue(wrappedTypeFriendlyId, out OpenApiSchema schema))
                    {
                        schema = context.SchemaGenerator.GenerateSchema(wrappedType, context.SchemaRepository);
                    }

                    // Replace the schema of the original response with the created schema of the wrapped response
                    operation.Responses
                        .Where(x => x.Key == "200" || x.Key == "500")
                        .Select(x => x.Value)
                        .ToList()
                        .ForEach(x =>
                        {
                            if (wrappedType == typeof(AjaxResponse))
                            {
                                // for void return types, scafold the content first
                                x.Content.Add("text/plain", new OpenApiMediaType());
                                x.Content.Add("application/json", new OpenApiMediaType());
                                x.Content.Add("text/json", new OpenApiMediaType());
                            }
                            foreach (var apiMediaType in x.Content)
                            {
                                apiMediaType.Value.Schema = schema;
                            }
                        });
                });
        }
    }
}
