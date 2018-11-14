using Abp.Authorization;
using Abp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

namespace Satrabel.OpenApp.Web.Startup
{
    public class WrapAjaxResponseOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
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
                .Where(x => x != null)
                //.Where(x => x.Type.Equals(typeof(void)) == false)
                .ToList()
                .ForEach(response => {
                    // Wrap the type with AjaxResponse<GenericType> so we get AjaxResponse<SpecificType>
                    var wrappedType = response.Type.Equals(typeof(void)) ? typeof(AjaxResponse) : typeof(AjaxResponse<>).MakeGenericType(response.Type);
                    var wrappedTypeFriendlyId = wrappedType.FriendlyId();

                    // Add AjaxResponse<SpecificType> schema manually (since it will not be picked up by ApiDefinition/Swashbuckle)
                    if (!context.SchemaRegistry.Definitions.TryGetValue(wrappedTypeFriendlyId, out Schema schema))
                    {
                        schema = context.SchemaRegistry.GetOrRegister(wrappedType);
                    }

                    // Replace the schema of the original response with the created schema of the wrapped response
                    operation.Responses
                        .Where(x => x.Key == "200" || x.Key == "500")
                        .Select(x => x.Value)
                        .ToList()
                        .ForEach(x => x.Schema = schema);
                });
        }
    }
}
