using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Abp.Authorization.Users;
using Abp.Extensions;
using Satrabel.OpenApp.Authorization.Users;

namespace Satrabel.OpenApp.Web.Models.Account
{
    public class ResetPasswordViewModel //: IValidatableObject
    {
        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        public string Code { get; set; }

        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        public string Password { get; set; }


        //public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        //{
        //    if (!UserName.IsNullOrEmpty())
        //    {
        //        var emailRegex = new Regex(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");
        //        if (!UserName.Equals(EmailAddress) && emailRegex.IsMatch(UserName))
        //        {
        //            yield return new ValidationResult("Username cannot be an email address unless it's same with your email address !");
        //        }
        //    }
        //}
    }
}