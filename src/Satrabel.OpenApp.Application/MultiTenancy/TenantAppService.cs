using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Satrabel.OpenApp.Authorization;
using Satrabel.OpenApp.Authorization.Roles;
using Satrabel.OpenApp.Authorization.Users;
using Satrabel.OpenApp.Editions;
using Satrabel.OpenApp.MultiTenancy.Dto;
using System.Collections.Generic;
using Abp.Localization;
using Abp.Configuration;

namespace Satrabel.OpenApp.MultiTenancy
{
    [AbpAuthorize(PermissionNames.Pages_Tenants)]
    public class TenantAppService : AsyncCrudAppService<Tenant, TenantDto, int, TenantFilterDto, CreateTenantDto, TenantDto>, ITenantAppService
    {
        private readonly TenantManager _tenantManager;
        private readonly EditionManager _editionManager;
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IAbpZeroDbMigrator _abpZeroDbMigrator;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ISettingDefinitionManager _settingDefinitionManager;

        public TenantAppService(
            IRepository<Tenant, int> repository,
            TenantManager tenantManager,
            EditionManager editionManager,
            UserManager userManager,
            RoleManager roleManager,
            IAbpZeroDbMigrator abpZeroDbMigrator,
            IPasswordHasher<User> passwordHasher,
            ISettingDefinitionManager settingDefinitionManager)
            : base(repository)
        {
            _tenantManager = tenantManager;
            _editionManager = editionManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _abpZeroDbMigrator = abpZeroDbMigrator;
            _passwordHasher = passwordHasher;
            _settingDefinitionManager = settingDefinitionManager;
        }

        public override async Task<TenantDto> CreateAsync(CreateTenantDto input)
        {
            CheckCreatePermission();

            // Create tenant
            var tenant = ObjectMapper.Map<Tenant>(input);
            tenant.ConnectionString = input.ConnectionString.IsNullOrEmpty()
                ? null
                : SimpleStringCipher.Instance.Encrypt(input.ConnectionString);

            var defaultEdition = await _editionManager.FindByNameAsync(EditionManager.DefaultEditionName);
            if (defaultEdition != null)
            {
                tenant.EditionId = defaultEdition.Id;
            }

            await _tenantManager.CreateAsync(tenant);
            await CurrentUnitOfWork.SaveChangesAsync(); // To get new tenant's id.

            // Create tenant database
            _abpZeroDbMigrator.CreateOrMigrateForTenant(tenant);

            // We are working entities of new tenant, so changing tenant filter
            using (CurrentUnitOfWork.SetTenantId(tenant.Id))
            {
                // Create static roles for new tenant
                CheckErrors(await _roleManager.CreateStaticRoles(tenant.Id));

                await CurrentUnitOfWork.SaveChangesAsync(); // To get static role ids

                // Grant all permissions to admin role
                var adminRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);
                await _roleManager.GrantAllPermissionsAsync(adminRole);

                // Create admin user for the tenant
                var adminUser = User.CreateTenantAdminUser(tenant.Id, input.AdminEmailAddress);
                await _userManager.InitializeOptionsAsync(tenant.Id);
                CheckErrors(await _userManager.CreateAsync(adminUser, User.DefaultPassword));
                await CurrentUnitOfWork.SaveChangesAsync(); // To get admin user's id

                // Assign admin user to role!
                CheckErrors(await _userManager.AddToRoleAsync(adminUser, adminRole.Name));
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return MapToEntityDto(tenant);
        }
        protected override TenantDto MapToEntityDto(Tenant entity)
        {
            //var dto = base.MapToEntityDto(entity);
            var dto = new TenantDto()
            {
                Id = entity.Id,
                Name = entity.Name,
                TenancyName = entity.TenancyName,
                IsActive = entity.IsActive
            };
            var featureDefs = _tenantManager.FeatureManager.GetAll().Where(f => f.Scope.HasFlag(Abp.Application.Features.FeatureScopes.Tenant));
            //var features = _tenantManager.GetFeatureValues(entity.Id);
            foreach (var featureDef in featureDefs)
            {
                var value = featureDef.DefaultValue;
                var featureValue = _tenantManager.GetFeatureValueOrNull(entity.Id, featureDef.Name);
                if (featureValue != null)
                {
                    value = featureValue;
                }
                dto.Features.Add(new FeatureDto()
                {
                    Name = featureDef.Name,
                    DisplayName = featureDef.DisplayName?.Localize(LocalizationManager),
                    Value = value,
                    InputType = featureDef.InputType?.Name,
                    Validator = featureDef.InputType?.Validator?.Name
                });

            }
            var settingDefs = _settingDefinitionManager.GetAllSettingDefinitions().Where(s => s.Scopes.HasFlag(SettingScopes.Tenant));
            foreach (var settingDef in settingDefs)
            {
                var value = settingDef.DefaultValue;
                var settingValue = SettingManager.GetSettingValueForTenant(settingDef.Name, entity.Id);
                if (settingValue != null)
                {
                    value = settingValue;
                }
                dto.Settings.Add(new SettingDto()
                {
                    Name = settingDef.Name,
                    DisplayName = settingDef.DisplayName?.Localize(LocalizationManager),
                    Value = value
                });

            }
            return dto;
        }
        protected override void MapToEntity(TenantDto updateInput, Tenant entity)
        {
            // Manually mapped since TenantDto contains non-editable properties too.
            entity.Name = updateInput.Name;
            entity.TenancyName = updateInput.TenancyName;
            entity.IsActive = updateInput.IsActive;

            foreach (var feature in updateInput.Features)
            {
                _tenantManager.SetFeatureValue(entity.Id, feature.Name, feature.Value);
            }

            foreach (var setting in updateInput.Settings)
            {
                SettingManager.ChangeSettingForTenant(entity.Id, setting.Name, setting.Value);
            }
        }

        public override async Task DeleteAsync(EntityDto<int> input)
        {
            CheckDeletePermission();

            var tenant = await _tenantManager.GetByIdAsync(input.Id);
            await _tenantManager.DeleteAsync(tenant);
        }

        private void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        protected override IQueryable<Tenant> CreateFilteredQuery(TenantFilterDto input)
        {
            var users = Repository.GetAll();
            if (!string.IsNullOrEmpty(input.Name))
            {
                users = users.Where(u => u.Name.StartsWith(input.Name));
            }
            return users;
        }
    }
}