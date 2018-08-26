using Xunit;

namespace Satrabel.OpenApp.Tests
{
    public sealed class MultiTenantFactAttribute : FactAttribute
    {
        public MultiTenantFactAttribute()
        {
            if (!OpenAppConsts.MultiTenancyEnabled)
            {
#pragma warning disable CS0162 // Impossible d'atteindre le code détecté
                Skip = "MultiTenancy is disabled.";
#pragma warning restore CS0162 // Impossible d'atteindre le code détecté
            }
        }
    }
}
