using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Localization;
using Satrabel.OpenApp.Authorization;
using Satrabel.OpenApp.LocalizationManager.Dto;

namespace Satrabel.OpenApp.LocalizationManager
{
    [AbpAuthorize(PermissionNames.Pages_Languages)]
    public class LocalizationManagerAppService : ApplicationService, ILocalizationManagerAppService
    {
        private readonly IRepository<ApplicationLanguageText, long> _repository;
        private readonly IApplicationLanguageTextManager _translationManager;
        private readonly ILocalizationManager _localizationManager;
        private readonly ApplicationLanguageManager _languageManager;
        private ApplicationLanguageText _defaultLanguage = null;


        public LocalizationManagerAppService(IRepository<ApplicationLanguageText, long> repository,
                                        IApplicationLanguageTextManager translationManager,
                                        ILocalizationManager localizationManager,
                                         ApplicationLanguageManager languageManager) 
        {
            _repository = repository;
            _translationManager = translationManager;
            _localizationManager = localizationManager;
            _languageManager = languageManager;
        }


        public async Task<PagedResultDto<TranslationDto>> GetAll(TranslationResultRequestDto input)
        {
            //CheckGetAllPermission();
            
            var lst = new List<TranslationDto>();
            foreach (var language in await _languageManager.GetLanguagesAsync(AbpSession.TenantId))
            {
                foreach (var source in _localizationManager.GetAllSources())
                {
                    foreach (var item in source.GetAllStrings(new CultureInfo("en")))
                    {
                        var value = source.GetStringOrNull(item.Name, new CultureInfo(language.Name), false);
                        lst.Add(new TranslationDto()
                        {
                            Key = item.Name,
                            Value = value,
                            Default = item.Value,
                            LanguageName = language.Name,
                            Source= source.Name
                        });
                    }
                }
            }
            if (!string.IsNullOrEmpty(input.LanguageName))
            {
                lst = lst.Where(t=> t.LanguageName == input.LanguageName).ToList();
            }
            if (input.NotTranslatedOnly)
            {
                lst = lst.Where(t => string.IsNullOrEmpty(t.Value)).ToList();
            }
            return new PagedResultDto<TranslationDto>() {
                Items = lst.Skip(input.SkipCount).Take(input.MaxResultCount).ToList(),
                TotalCount = lst.Count()
            };
        }
        public TranslationDto Get(EntityDto<string> input)
        {
            return null;
        }

            /*
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

                return MapToEntityDto(translation);
            }
            */
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