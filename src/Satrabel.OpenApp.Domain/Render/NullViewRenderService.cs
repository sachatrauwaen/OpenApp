using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Satrabel.OpenApp.Render
{
    public class NullViewRenderService : IViewRenderService
    {
        public static readonly IViewRenderService Instance = new NullViewRenderService();

        public Task<string> RenderToStringAsync(string viewName, object model)
        {
            return Task.FromResult(viewName);
        }
    }
}
