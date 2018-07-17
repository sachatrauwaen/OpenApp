﻿using System.Text;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Web.Api.Modeling;
using Abp.Web.Api.ProxyScripting.Generators;
using NJsonSchema.Generation;
using System.Threading.Tasks;
using System.Linq;
using Abp;
using System;
using NJsonSchema.Generation.TypeMappers;
using NJsonSchema;
using NJsonSchema.Infrastructure;
using Newtonsoft.Json;
using System.Collections.Generic;
using Castle.Core.Logging;

namespace Satrabel.OpenApp.ProxyScripting
{

    class JsonSchemaProxyScriptGenerator : IProxyScriptGenerator, ITransientDependency
    {

        //private const SchemaType SerializationSchemaType = SchemaType.JsonSchema;
        //private static Lazy<PropertyRenameAndIgnoreSerializerContractResolver> ContractResolver = new Lazy<PropertyRenameAndIgnoreSerializerContractResolver>(
        //    () => JsonSchema4.CreateJsonSerializerContractResolver(SerializationSchemaType));

        public ILogger Logger { get; set; }

        /// <summary>
        /// "jquery".
        /// </summary>
        public const string Name = "json";

        private JsonSchemaGenerator generator;

        public JsonSchemaProxyScriptGenerator()
        {
            Logger = NullLogger.Instance;
            var settings = new JsonSchemaGeneratorSettings();
            settings.FlattenInheritanceHierarchy = true;
            settings.DefaultPropertyNameHandling = NJsonSchema.PropertyNameHandling.CamelCase;
            settings.DefaultReferenceTypeNullHandling = NJsonSchema.ReferenceTypeNullHandling.NotNull;
            settings.AllowReferencesWithProperties = false;
            settings.SchemaType = NJsonSchema.SchemaType.JsonSchema;
            generator = new JsonSchemaGenerator(settings);

        }


        public string CreateScript(ApplicationApiDescriptionModel model)
        {
            var script = new StringBuilder();
            script.AppendLine("/* This file is automatically generated by OpenApp. */");
            script.AppendLine();
            script.AppendLine("var abp = abp || {};");
            script.AppendLine("abp.schemas = abp.schemas || {};");
            foreach (var module in model.Modules.Values)
            {
                script.AppendLine();
                AddModuleScript(script, module);
            }
            return script.ToString();
        }

        private void AddModuleScript(StringBuilder script, ModuleApiDescriptionModel module)
        {
            script.AppendLine($"// module '{module.Name.ToCamelCase()}'");
            script.AppendLine("(function(){");
            script.AppendLine();
            script.AppendLine($"abp.schemas.{module.Name.ToCamelCase()} = abp.schemas.{module.Name.ToCamelCase()} || {{}};");
            foreach (var controller in module.Controllers.Values)
            {
                script.AppendLine();
                AddControllerScript(script, module, controller);
            }
            script.AppendLine();
            script.AppendLine("})();");
        }
        private void AddControllerScript(StringBuilder script, ModuleApiDescriptionModel module, ControllerApiDescriptionModel controller)
        {
            script.AppendLine($"// controller '{controller.Name.ToCamelCase()}'");
            script.AppendLine($"abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()} = abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()} || {{}};");
            /*
            var get = controller.Actions.Values.FirstOrDefault(a => a.Name.Equals("get", StringComparison.InvariantCultureIgnoreCase));
            if (get != null)
            {
                script.AppendLine($"    // get return type");
                string varStr = $"abp.schemas.{ module.Name.ToCamelCase()}.{ controller.Name.ToCamelCase()}.get";
                script.AppendLine($"    {varStr} = {varStr} || {{}};");
                var type = get.ReturnValue.Type;
                if (type != typeof(Task))
                {
                    if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Task<>))
                    {
                        type = type.GetGenericArguments()[0]; // use this...
                    }
                    var schema = generator.GenerateAsync(type).GetAwaiter().GetResult();
                    var schemaData = schema.ToJson();
                    //schema.Title = action.ReturnValue.Type.Name;
                    script.Append($"    {varStr} =  ");
                    script.AppendLine(schemaData);
                }
            }
            // getall
            var getall = controller.Actions.Values.FirstOrDefault(a => a.Name.Equals("getall", StringComparison.InvariantCultureIgnoreCase));
            if (getall != null)
            {
                script.AppendLine($"    // getall parameters");
                string varStr = $"abp.schemas.{ module.Name.ToCamelCase()}.{ controller.Name.ToCamelCase()}.filter";
                //script.AppendLine($"    {varStr} = {varStr} || {{}};");


                if (getall.Parameters.Count == 1)
                {
                    script.Append($"    {varStr} = ");
                    //script.AppendLine("{");
                    foreach (var parameter in getall.Parameters)
                    {
                        var type = parameter.Type;
                        var schema = generator.GenerateAsync(type).GetAwaiter().GetResult();
                        if (parameter.BindingSourceId.IsIn(ParameterBindingSources.ModelBinding, ParameterBindingSources.Query))
                        {
                            schema.Title = parameter.Name;
                            schema.Default = parameter.DefaultValue;
                            //schema.re = parameter.IsOptional
                        }
                        var schemaData = schema.ToJson();
                        //script.Append($"    abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()}.{action.Name.ToCamelCase()}.{parameter.Name.ToCamelCase()} =  ");
                        // script.Append($"    {parameter.Name.ToCamelCase()} :  ");
                        script.Append(schemaData).Append(";") ;
                        //script.AppendLine(",");
                    }
                    //script.AppendLine("    };");
                }
            }
            */
            foreach (var action in controller.Actions.Values)
            {
                AddActionScript(script, module, controller, action);
            }
        }

        private void AddActionScript(StringBuilder script, ModuleApiDescriptionModel module, ControllerApiDescriptionModel controller, ActionApiDescriptionModel action)
        {
            script.AppendLine($"// action '{action.Name.ToCamelCase()}'");
            script.AppendLine($"abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()}.{action.Name.ToCamelCase()} = abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()}.{action.Name.ToCamelCase()} || {{}};");
            var type = action.ReturnValue.Type;
            if (type != typeof(Task))
            {
                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Task<>))
                {
                    type = type.GetGenericArguments()[0]; // use this...
                }
                var schema = generator.GenerateAsync(type).GetAwaiter().GetResult();
                schema = CleanUpSchema(schema);
                var schemaData = schema.ToJson();
                //schema.Title = action.ReturnValue.Type.Name;
                script.Append($"abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()}.{action.Name.ToCamelCase()}.returnValue =  ");
                script.AppendLine(schemaData);
            }
            if (action.Parameters.Any())
            {
                script.Append($"abp.schemas.{module.Name.ToCamelCase()}.{controller.Name.ToCamelCase()}.{action.Name.ToCamelCase()}.parameters = ");
                script.AppendLine("{");
                foreach (var parameter in action.Parameters)
                {
                    type = parameter.Type;
                    var schema = generator.GenerateAsync(type).GetAwaiter().GetResult();
                    if (parameter.BindingSourceId.IsIn(ParameterBindingSources.ModelBinding, ParameterBindingSources.Query))
                    {
                        schema.Title = parameter.Name;
                        schema.Default = parameter.DefaultValue;
                        //schema.re = parameter.IsOptional
                    }
                    schema = CleanUpSchema(schema);
                    var schemaData = schema.ToJson();
                    script.Append($"    {parameter.Name.ToCamelCase()} :  ");
                    script.Append(schemaData);
                    script.AppendLine(",");
                }
                script.AppendLine("};");
            }
        }

        private JsonSchema4 CleanUpSchema(JsonSchema4 schema)
        {
            var sch = new JsonSchema4();
            try
            {
                CopyFields(schema, sch);
                foreach (var item in schema.ActualSchema.ActualProperties)
                {
                    sch.Properties.Add(item.Key, CleanUpSchema(item.Value));
                }
            }
            catch (Exception ex)
            {
                Logger.Error("CleanupSchema error ("+schema.Title+")", ex);
                throw;
            }
            return sch;
        }
        private JsonProperty CleanUpSchema(JsonProperty schema)
        {
            var sch = new JsonProperty();
            sch.IsRequired = schema.IsRequired;
            sch.IsReadOnly = schema.IsReadOnly;
            CopyFields(schema, sch);
            foreach (var item in schema.ActualSchema.ActualProperties)
            {
                sch.Properties.Add(item.Key, CleanUpSchema(item.Value));
            }
            if (schema.OneOf.Count == 1)
            {
                CopyFields(schema.OneOf.First().ActualSchema, sch);
            }
            return sch;
        }

        private static void CopyFields(JsonSchema4 schema, JsonSchema4 sch)
        {
            if (!string.IsNullOrEmpty(schema.Title))
            {
                sch.Title = schema.Title;
            }
            if (schema.Type != JsonObjectType.None)
            {
                sch.Type = schema.Type;
                sch.Type &= ~JsonObjectType.Null; // remove null
            }
            if (!string.IsNullOrEmpty(schema.Format))
            {
                sch.Format = schema.Format;
            }
            if (schema.Minimum.HasValue)
            {
                sch.Minimum = schema.Minimum;
            }
            if (schema.Maximum.HasValue)
            {
                sch.Maximum = schema.Maximum;
            }
            if (schema.MinLength.HasValue)
            {
                sch.MinLength = schema.MinLength;
            }
            if (schema.MaxLength.HasValue)
            {
                sch.MaxLength = schema.MaxLength;
            }
            foreach (var item in schema.Enumeration)
            {
                sch.Enumeration.Add(item);
            }
            foreach (var item in schema.EnumerationNames)
            {
                sch.EnumerationNames.Add(item);
            }
            // arrays
            foreach (var item in schema.Items)
            {
                sch.Items.Add(item);
            }
            if (schema.ExtensionData != null)
            {
                sch.ExtensionData = new Dictionary<string, object>();
                foreach (var item in schema.ExtensionData)
                {
                    sch.ExtensionData.Add(item);
                }
            }
        }
    }

}