using NJsonSchema.Annotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.UIAttributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = true)]
    public class UIGridAttribute: JsonSchemaExtensionDataAttribute
    {
        public UIGridAttribute(bool show) : base("x-ui-grid",show)
        {

        }
    }
}
