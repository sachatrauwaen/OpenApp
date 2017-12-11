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
using Satrabel.OpenApp.Localizations.Dto;
using Abp.Domain.Uow;
using Microsoft.AspNetCore.Mvc;

namespace Satrabel.OpenApp.Localizations
{
    [AbpAuthorize(PermissionNames.Pages_Languages)]
    public class LocalizationAppService : ApplicationService, ILocalizationAppService
    {
        private readonly IRepository<ApplicationLanguageText, long> _repository;
        private readonly IApplicationLanguageTextManager _translationManager;
        private readonly ILocalizationManager _localizationManager;
        private readonly ApplicationLanguageManager _languageManager;


        public LocalizationAppService(IRepository<ApplicationLanguageText, long> repository,
                                        IApplicationLanguageTextManager translationManager,
                                        ILocalizationManager localizationManager,
                                        ApplicationLanguageManager languageManager)
        {
            _repository = repository;
            _translationManager = translationManager;
            _localizationManager = localizationManager;
            _languageManager = languageManager;
        }

        [HttpPost] // voor filter form
        public async Task<PagedResultDto<LocalizationDto>> GetAll(LocalizationResultRequestDto input)
        {
            //CheckGetAllPermission();
            var lst = new List<LocalizationDto>();
            foreach (var language in await _languageManager.GetLanguagesAsync(AbpSession.TenantId))
            {
                foreach (var source in _localizationManager.GetAllSources())
                {
                    foreach (var item in source.GetAllStrings(new CultureInfo("en")))
                    {
                        var value = source.GetStringOrNull(item.Name, new CultureInfo(language.Name), false);
                        lst.Add(new LocalizationDto()
                        {
                            Key = item.Name,
                            Value = value,
                            Default = item.Value,
                            LanguageName = language.Name,
                            Source = source.Name
                        });
                    }
                }
            }
            if (!string.IsNullOrEmpty(input.LanguageSource))
            {
                lst = lst.Where(t => t.Source == input.LanguageSource).ToList();
            }
            if (!string.IsNullOrEmpty(input.LanguageName))
            {
                lst = lst.Where(t => t.LanguageName == input.LanguageName).ToList();
            }
            if (!string.IsNullOrEmpty(input.LanguageKey))
            {
                lst = lst.Where(t => t.Key.ToLower().Contains(input.LanguageKey.ToLower())).ToList();
            }
            if (input.NotTranslatedOnly)
            {
                lst = lst.Where(t => string.IsNullOrEmpty(t.Value)).ToList();
            }
            return new PagedResultDto<LocalizationDto>()
            {
                Items = lst.Skip(input.SkipCount).Take(input.MaxResultCount).ToList(),
                TotalCount = lst.Count()
            };
        }

        [UnitOfWork(IsDisabled = true)]
        public async void Save(LocalizationDto input)
        {
            await _translationManager.UpdateStringAsync(AbpSession.TenantId, input.Source, new CultureInfo(input.LanguageName), input.Key, input.Value);
        }
        public LocalizationDto Get(EntityDto<string> input)
        {
            return null; // for crud grid
        }

        public List<SourceDto> GetSources()
        {
            var sources = _localizationManager.GetAllSources();
            return ObjectMapper.Map<List<SourceDto>>(sources);
        }
        public async Task<List<LanguageDto>> GetLanguages()
        {
            var languages = await _languageManager.GetLanguagesAsync(AbpSession.TenantId);
            return ObjectMapper.Map<List<LanguageDto>>(languages);
        }

    }
}