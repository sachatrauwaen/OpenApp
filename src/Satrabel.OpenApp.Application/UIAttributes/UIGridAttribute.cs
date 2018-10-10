using NJsonSchema.Annotations;
using System;

namespace Satrabel.OpenApp.UIAttributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = true)]
    public sealed class UIGridAttribute : JsonSchemaExtensionDataAttribute
    {
        public UIGridAttribute(bool show) : base("x-ui-grid", show)
        {

        }
    }
}
