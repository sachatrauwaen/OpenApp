using System.ComponentModel.DataAnnotations;

namespace Satrabel.OpenApp.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}