using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Satrabel.OpenApp.Startup.Swashbuckle
{
    /// <summary>
    /// Taken from : https://github.com/domaindrivendev/Swashbuckle/issues/1146
    /// 
    /// Swashbuckle generates enums inline. This causes tools like NSwag to create multiple type definitions, instead of referencing a single type.
    /// This filter uses the same trick that the NSwag Swagger definition generator uses to create a reference to the enum.
    /// </summary>
    public class NoDuplicatedEnumsOperationFilter : ISchemaFilter
    {
        public void Apply(Schema model, SchemaFilterContext context)
        {
            if (model.Properties == null)
                return;

            var enumProperties = model.Properties.Where(p => p.Value.Enum != null)
                .Union(model.Properties.Where(p => p.Value.Items?.Enum != null)).ToList();
            var enums = context.SystemType.GetProperties()
                .Select(p => Nullable.GetUnderlyingType(p.PropertyType) ?? p.PropertyType.GetElementType() ??
                                p.PropertyType.GetGenericArguments().FirstOrDefault() ?? p.PropertyType)
                .Where(p => p.GetTypeInfo().IsEnum)
                .ToList();

            foreach (var enumProperty in enumProperties)
            {
                var enumPropertyValue = enumProperty.Value.Enum != null ? enumProperty.Value : enumProperty.Value.Items;

                var enumValues = enumPropertyValue.Enum.Select(e => $"{e}").ToList();
                var enumType = enums.FirstOrDefault(p =>
                {
                    var enumNames = Enum.GetNames(p);
                    if (enumNames.Except(enumValues, StringComparer.InvariantCultureIgnoreCase).Any())
                        return false;
                    if (enumValues.Except(enumNames, StringComparer.InvariantCultureIgnoreCase).Any())
                        return false;
                    return true;
                });

                if (enumType == null)
                    throw new Exception($"Property {enumProperty} not found in {context.SystemType.Name} Type.");

                if (context.SchemaRegistry.Definitions.ContainsKey(enumType.Name) == false)
                    context.SchemaRegistry.Definitions.Add(enumType.Name, enumPropertyValue);

                var schema = new Schema
                {
                    Ref = $"#/definitions/{enumType.Name}"
                };
                if (enumProperty.Value.Enum != null)
                {
                    model.Properties[enumProperty.Key] = schema;
                }
                else if (enumProperty.Value.Items?.Enum != null)
                {
                    enumProperty.Value.Items = schema;
                }
            }
        }

        private void CheckType(Response response, ISchemaRegistry schemaRegistry, Type enumType)
        {
            // Recurse
            enumType
                .GenericTypeArguments
                .ToList()
                .ForEach(type => CheckType(response, schemaRegistry, type));

            enumType
                .GetProperties()
                .ToList()
                .ForEach(prop => CheckType(response, schemaRegistry, prop.PropertyType));

            if (enumType.IsEnum == false)
                return;

            if (schemaRegistry.Definitions.ContainsKey(enumType.Name) == false)
                schemaRegistry.Definitions.Add(enumType.Name, schemaRegistry.GetOrRegister(enumType));

            var schema = new Schema
            {
                Ref = $"#/definitions/{enumType.Name}"
            };
            response.Extensions.Add("x-schema", schema);
        }

        private void CheckType(IParameter parameter, ISchemaRegistry schemaRegistry, Type enumType)
        {
            // Recurse
            enumType
                .GenericTypeArguments
                .ToList()
                .ForEach(type => CheckType(parameter, schemaRegistry, type));

            enumType
                .GetProperties()
                .ToList()
                .ForEach(prop => CheckType(parameter, schemaRegistry, prop.PropertyType));

            if (enumType.IsEnum == false)
                return;

            if (schemaRegistry.Definitions.ContainsKey(enumType.Name) == false)
                schemaRegistry.Definitions.Add(enumType.Name, schemaRegistry.GetOrRegister(enumType));

            var schema = new Schema
            {
                Ref = $"#/definitions/{enumType.Name}"
            };
            parameter.Extensions.Add("x-schema", schema);
        }
    }
}
