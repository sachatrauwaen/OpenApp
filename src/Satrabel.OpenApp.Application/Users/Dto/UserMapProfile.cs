using AutoMapper;
using Satrabel.OpenApp.Authorization.Users;

namespace Satrabel.OpenApp.Users.Dto
{
    public class UserMapProfile : Profile
    {
        public UserMapProfile()
        {
            CreateMap<UserDto, User>();
            CreateMap<UserDto, User>()
                .ForMember(x => x.Roles, opt => opt.Ignore())
                .ForMember(x => x.CreationTime, opt => opt.Ignore())
                .ForMember(x => x.LastLoginTime, opt => opt.Ignore());

            CreateMap<CreateUserDto, User>();
            CreateMap<CreateUserDto, User>().ForMember(x => x.Roles, opt => opt.Ignore());

            CreateMap<UpdateUserDto, User>();
            CreateMap<UpdateUserDto, User>().ForMember(x => x.Roles, opt => opt.Ignore())
                                            .ForMember(x => x.Password, opt => opt.Ignore());
        }
    }
}
