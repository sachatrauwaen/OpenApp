using AutoMapper;
using Satrabel.OpenApp.Authorization.Users;

namespace Satrabel.OpenApp.Users.Dto
{
    public class UserMapProfile : Profile
    {
        public UserMapProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(x => x.Settings, opt => opt.Ignore());

            CreateMap<UserDto, User>()
                .ForMember(x => x.Roles, opt => opt.Ignore())
                .ForMember(x => x.Settings, opt => opt.Ignore())
                .ForMember(x => x.CreationTime, opt => opt.Ignore());

            CreateMap<CreateUserDto, User>()
                .ForMember(x => x.Roles, opt => opt.Ignore())
                .ForMember(x => x.Settings, opt => opt.Ignore());

            CreateMap<UpdateUserDto, User>()
                .ForMember(x => x.Roles, opt => opt.Ignore())
                .ForMember(x => x.Settings, opt => opt.Ignore())
                .ForMember(x => x.Password, opt => opt.Ignore());
        }
    }
}
