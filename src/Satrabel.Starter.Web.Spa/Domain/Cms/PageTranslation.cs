using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;

namespace Satrabel.Starter.Web.Domain.Cms
{
    public class PageTranslation : AuditedEntity, IEntityTranslation<Page>, IExtendableObject
    {
        public Page Core { get; set; }
        public int CoreId { get; set; }

        [MaxLength(DomainConstants.MaxLanguageLength)]
        public string Language { get; set; }

        [MaxLength(DomainConstants.MaxTitleLength)]
        public string Name { get; set; }

        [MaxLength(DomainConstants.MaxSlugLength)]
        public string Slug { get; set; }
        public string ExtensionData { get; set; }
    }
}