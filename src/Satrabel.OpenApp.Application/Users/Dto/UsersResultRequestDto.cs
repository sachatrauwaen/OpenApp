using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Satrabel.OpenApp.Users.Dto
{
    public class UsersResultRequestDto: PagedResultRequestDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
