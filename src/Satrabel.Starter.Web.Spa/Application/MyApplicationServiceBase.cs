using Abp.Application.Services;

namespace Satrabel.Starter.Web.Application
{
    /// <summary>
    /// Derive your application services from this class.
    /// </summary>
    /// <seealso cref="Abp.Application.Services.ApplicationService" />
    /// <inheritdoc />
    public abstract class MyApplicationServiceBase : ApplicationService
    {
        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:HolonCom.Europeade.Application.MyApplicationServiceBase" /> class.
        /// </summary>
        protected MyApplicationServiceBase()
        {
            LocalizationSourceName = AppConsts.LocalizationSourceName;
        }
    }
}