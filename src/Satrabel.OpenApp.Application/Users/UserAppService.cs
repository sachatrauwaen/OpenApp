using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.IdentityFramework;
using Abp.Localization;
using Abp.Runtime.Session;
using Satrabel.OpenApp.Authorization;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.Roles.Dto;
using Satrabel.OpenApp.Users.Dto;
using System;

namespace Satrabel.OpenApp.Users
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class UserAppService : AsyncCrudAppService<User, UserDto, long, UsersResultRequestDto, CreateUserDto, UpdateUserDto>, IUserAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<Role> _roleRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserAppService(
            IRepository<User, long> repository,
            UserManager userManager,
            RoleManager roleManager,
            IRepository<Role> roleRepository,
            IPasswordHasher<User> passwordHasher)
            : base(repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _roleRepository = roleRepository;
            _passwordHasher = passwordHasher;
        }

        public override async Task<UserDto> Create(CreateUserDto input)
        {
            CheckCreatePermission();

            var user = ObjectMapper.Map<User>(input);

            if (AbpSession.UserId == null) throw new Abp.UI.UserFriendlyException("You are not logged in.");
            var editor = await _userManager.GetUserByIdAsync((long)AbpSession.UserId);

            user.TenantId = AbpSession.TenantId;
            user.IsEmailConfirmed = true;

            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

            CheckErrors(await _userManager.CreateAsync(user, input.Password));

            if (input.RoleNames != null)
            {
                var editorIsAdmin = await _userManager.IsInRoleAsync(editor, StaticRoleNames.Host.Admin);
                var roleNamesContainsAdmin = input.RoleNames.Select(name => name.ToUpper()).Contains(StaticRoleNames.Host.Admin.ToUpper());

                if (roleNamesContainsAdmin && !editorIsAdmin) throw new Abp.UI.UserFriendlyException("You are not allowed to assign the admin role.");

                CheckErrors(await _userManager.SetRoles(user, input.RoleNames));
            }

            CurrentUnitOfWork.SaveChanges();

            return MapToEntityDto(user);
        }

        public override async Task<UserDto> Update(UpdateUserDto input)
        {
            CheckUpdatePermission();

            var user = await _userManager.GetUserByIdAsync(input.Id);

            if (AbpSession.UserId == null) throw new Abp.UI.UserFriendlyException("You are not logged in.");
            var editor = await _userManager.GetUserByIdAsync((long)AbpSession.UserId);

            MapToEntity(input, user);
            if (!string.IsNullOrEmpty(input.Password))
            {
                user.Password = _passwordHasher.HashPassword(user, input.Password);
            }

            CheckErrors(await _userManager.UpdateAsync(user));

            if (input.RoleNames != null)
            {
                var editorIsAdmin = await _userManager.IsInRoleAsync(editor, StaticRoleNames.Host.Admin);
                var roleNamesContainsAdmin = input.RoleNames.Select(name => name.ToUpper()).Contains(StaticRoleNames.Host.Admin.ToUpper());

                if (roleNamesContainsAdmin && !editorIsAdmin) throw new Abp.UI.UserFriendlyException("You are not allowed to assign the admin role.");

                CheckErrors(await _userManager.SetRoles(user, input.RoleNames));
            }

            return await Get(input);
        }

        public override async Task Delete(EntityDto<long> input)
        {
            var user = await _userManager.GetUserByIdAsync(input.Id);
            await _userManager.DeleteAsync(user);
        }

        public async Task<ListResultDto<RoleDto>> GetRoles()
        {
            var roles = await _roleRepository.GetAllListAsync();
            return new ListResultDto<RoleDto>(ObjectMapper.Map<List<RoleDto>>(roles));
        }

        public async Task ChangeLanguage(ChangeUserLanguageDto input)
        {
            await SettingManager.ChangeSettingForUserAsync(
                AbpSession.ToUserIdentifier(),
                LocalizationSettingNames.DefaultLanguage,
                input.LanguageName
            );
        }

        protected override User MapToEntity(CreateUserDto createInput)
        {
            var user = ObjectMapper.Map<User>(createInput);
            user.SetNormalizedNames();
            return user;
        }

        protected override void MapToEntity(UpdateUserDto input, User user)
        {
            ObjectMapper.Map(input, user);
            user.SetNormalizedNames();
        }

        protected override UserDto MapToEntityDto(User user)
        {
            var roles = _roleManager.Roles.Where(r => user.Roles.Any(ur => ur.RoleId == r.Id)).Select(r => r.NormalizedName);
            var userDto = base.MapToEntityDto(user);
            userDto.RoleNames = roles.ToArray();
            return userDto;
        }

        protected override IQueryable<User> CreateFilteredQuery(UsersResultRequestDto input)
        {
            var users = Repository.GetAllIncluding(x => x.Roles);
            if (!string.IsNullOrEmpty(input.UserName))
            {
                users = users.Where(u => u.UserName.StartsWith(input.UserName));
            }
            if (!string.IsNullOrEmpty(input.Email))
            {
                users = users.Where(u => u.EmailAddress.StartsWith(input.Email));
            }
            return users;
        }

        protected override async Task<User> GetEntityByIdAsync(long id)
        {
            return await Repository.GetAllIncluding(x => x.Roles).FirstOrDefaultAsync(x => x.Id == id);
        }

        protected override IQueryable<User> ApplySorting(IQueryable<User> query, UsersResultRequestDto input)
        {
            IOrderedQueryable<User> retval;
            System.Linq.Expressions.Expression<Func<User, string>> sortingExpr = r => r.UserName;

            var sortingInfo = AppServiceHelper.BuildSortinginfo(input.Sorting);
            if (sortingInfo != null)
            {
                switch (sortingInfo.Item1)
                {
                    case "EmailAddress":
                        sortingExpr = r => r.EmailAddress;
                        break;
                    case "IsActive":
                        sortingExpr = r => r.IsActive.ToString();
                        break;
                    case "FullName":
                        sortingExpr = r => r.FullName;
                        break;
                    case "UserName":
                    default:
                        sortingExpr = r => r.UserName;
                        break;
                }

                retval = sortingInfo.Item2 == AppServiceHelper.SortOrder.DESC ? query.OrderByDescending(sortingExpr) : query.OrderBy(sortingExpr);
            }
            else
            {
                retval = query.OrderBy(sortingExpr);
            }

            return retval;
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}