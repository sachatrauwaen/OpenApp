using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Satrabel.Starter.Web.Application;

namespace Satrabel.Starter.Web.Startup
{
    internal class PageRule : IRule
    {
        private CmsAppService _cmsAppService = new CmsAppService();

        public PageRule()
        {

        }
        public void ApplyRule(RewriteContext context)
        {
            var request = context.HttpContext.Request;
            var url = request.Path.HasValue ? request.Path.Value : "";
            var page = _cmsAppService.GetBySlug(url);
            if (page != null)
            {
                var response = context.HttpContext.Response;
                request.Path = new PathString("/page");
                if (request.QueryString.HasValue)
                {
                    request.QueryString = new QueryString(request.QueryString.Value + "&id=" + page.Id);
                }
                else
                {
                    request.QueryString = new QueryString("?id=" + page.Id);
                }
                context.Result = RuleResult.SkipRemainingRules;
            }
            //if (!IsHandled(context) )
            //{
            //    //var siteId = GetSiteId(context);
            //    //var authorized = true;

            //    var request = context.HttpContext.Request;
            //    var url = request.Path.HasValue ? request.Path.Value : "";
            //    var page = _cmsAppService.GetBySlug(url);
            //    if (page != null)
            //    {
            //        var response = context.HttpContext.Response;
            //        request.Path = new PathString("/page");
            //        if (request.QueryString.HasValue)
            //        {
            //            request.QueryString = new QueryString(request.QueryString.Value + "&id="+page.Id + "&rewrite_handled = true");
            //        }
            //        else request.QueryString = new QueryString("?id="+page.Id + "&rewrite_handled = true");

            //        context.Result = RuleResult.SkipRemainingRules;
            //    }
            //}
        }
        protected bool IsHandled(RewriteContext context)
        {
            var values = context.HttpContext.Request.Query["rewrite_handled"];
            if (values.Count > 0)
            {
                return values[0] == "true";
            }
            return false;
        }
    }
}