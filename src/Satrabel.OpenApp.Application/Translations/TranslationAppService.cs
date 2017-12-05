using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Satrabel.OpenApp.Authorization;
using Abp.Authorization;
using Abp.Localization;
using Satrabel.OpenApp.Languages.Dto;
using Satrabel.OpenApp.Translations.Dto;

namespace Satrabel.OpenApp.Translations
{
    [AbpAuthorize(PermissionNames.Pages_Languages)]
    public class TranslationAppService : AsyncCrudAppService<ApplicationLanguageText, TranslationDto, long, TranslationResultRequestDto, TranslationDto, TranslationDto>, ITranslationAppService 
    {
        private readonly IApplicationLanguageTextManager _translationManager;
        private ApplicationLanguageText _defaultLanguage = null;

        public TranslationAppService(IRepository<ApplicationLanguageText, long> repository, IApplicationLanguageTextManager translationManager) : base(repository)
        {
            _translationManager = translationManager;
        }
        
        public override async Task<TranslationDto> Create(TranslationDto input)
        {
            CheckCreatePermission();
            var translation = ObjectMapper.Map<ApplicationLanguageText>(input);
            translation.TenantId = AbpSession.TenantId;
            await _translationManager.UpdateStringAsync(
                translation.TenantId,
                OpenAppConsts.LocalizationSourceName,
                new CultureInfo("en"),
                translation.Key,
                translation.Value
            );
            /*
            if (input.Default)
            {
                await _languageManager.SetDefaultLanguageAsync(AbpSession.TenantId, input.Name);
            }
            */
            return MapToEntityDto(translation);
        }

        //public ListResultDto<LanguageDto> GetLanguages()
        //{
        //    //var roles = _technicianRepository.GetAllList();
        //    //return new ListResultDto<TechnicianDto>(ObjectMapper.Map<List<TechnicianDto>>(roles));
        //}

        //protected override IQueryable<ApplicationLanguageText> CreateFilteredQuery(TranslationResultRequestDto input)
        //{
        //    var translations = Repository.GetAll();
        //    if (!string.IsNullOrEmpty(input.Language))
        //    {
        //        users = users.Where(u => u.UserName.StartsWith(input.UserName));
        //    }
        //    return users;
        //}


        /*
        public override async Task<TranslationDto> Update(TranslationDto input)
        {
            CheckUpdatePermission();
            var language = MapToEntity(input);
            await _languageManager.UpdateAsync(AbpSession.TenantId, language);
            if (input.Default)
            {
                await _languageManager.SetDefaultLanguageAsync(AbpSession.TenantId, input.Name);
            }
            return await Get(input);
        }

        public override async Task Delete(EntityDto<int> input)
        {
            var language = (await _languageManager.GetLanguagesAsync(AbpSession.TenantId)).FirstOrDefault(l => l.Id == input.Id);
            if (language == null)
            {
                return;
            }
            if (language.Name == "en")
            {
                throw new Abp.UI.UserFriendlyException("Can not delete 'en' language");
            }
            _defaultLanguage = await _languageManager.GetDefaultLanguageOrNullAsync(AbpSession.TenantId);
            if (language.Name == _defaultLanguage.Name)
            {
                throw new Abp.UI.UserFriendlyException("Can not delete default language");
            }
            await _languageManager.RemoveAsync(AbpSession.TenantId, language.Name);
        }

        public override async Task<TranslationDto> Get(EntityDto<int> input)
        {
            _defaultLanguage = await _languageManager.GetDefaultLanguageOrNullAsync(AbpSession.TenantId);
            return await base.Get(input);
        }

        public override async Task<PagedResultDto<TranslationDto>> GetAll(PagedResultRequestDto input)
        {
            _defaultLanguage = await _languageManager.GetDefaultLanguageOrNullAsync(AbpSession.TenantId);
            return await base.GetAll(input);
        }
        protected override TranslationDto MapToEntityDto(ApplicationLanguage language)
        {
            var languageDto = base.MapToEntityDto(language);
            languageDto.Default = _defaultLanguage != null && language.Name == _defaultLanguage.Name;
            return languageDto;
        }
        protected override IQueryable<ApplicationLanguage> ApplySorting(IQueryable<ApplicationLanguage> query, PagedResultRequestDto input)
        {
            return query.OrderBy(r => r.Name);
        }
        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
        */
    }
}