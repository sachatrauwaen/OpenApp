using Abp.Authorization;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;

namespace Satrabel.OpenApp.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
