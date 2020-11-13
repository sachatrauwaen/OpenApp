using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Satrabel.OpenApp.Render
{
    class NullViewRenderService : IViewRenderService
    {
        static public IViewRenderService Instance = new NullViewRenderService();

        public async Task<string> RenderToStringAsync(string viewName, object model)
        {
            return viewName;
        }
    }
}
