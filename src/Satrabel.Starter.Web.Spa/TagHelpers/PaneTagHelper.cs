using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Satrabel.Starter.Web.Application;
using Satrabel.Starter.Web.Application.Cms;
using Satrabel.Starter.Web.ViewComponents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.TagHelpers
{
    [HtmlTargetElement("pane", Attributes = WidgetNameAttributeName)]
    public class PaneTagHelper : TagHelper
    {
        private const string WidgetNameAttributeName = "name";
        private readonly IViewComponentHelper _viewComponentHelper;

        public PaneTagHelper(IViewComponentHelper viewComponentHelper)
        {
            _viewComponentHelper = viewComponentHelper;
        }

        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }

        [HtmlAttributeName(WidgetNameAttributeName)]
        public string Name { get; set; }

        public List<ModuleDto> Modules { get; set; }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            ((IViewContextAware)_viewComponentHelper).Contextualize(ViewContext);
            var content = await _viewComponentHelper.InvokeAsync(typeof(PaneViewComponent), Modules.Where(p=> p.PaneName == Name).ToList());
            output.Content.SetHtmlContent(content);
        }
    }
}
