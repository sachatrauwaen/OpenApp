using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.Starter.Web.Domain.Cms
{
    public class ModuleTranslation : AuditedEntity, IEntityTranslation<Module>, IExtendableObject
    {
        

        public Module Core { get; set; }
        public int CoreId { get; set; }

        [MaxLength(DomainConstants.MaxLanguageLength)]
        public string Language { get; set; }

        [MaxLength(DomainConstants.MaxTitleLength)]
        public string Title { get; set; }
        public string ExtensionData { get; set; }
    }
}