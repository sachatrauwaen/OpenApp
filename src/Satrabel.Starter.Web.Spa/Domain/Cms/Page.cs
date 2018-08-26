using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Domain.Cms
{
    [Table("CmsPage")]
    public class Page: FullAuditedAggregateRoot, IPassivable, IExtendableObject, IMustHaveTenant
    {
        public string Name { get; set; }
        public string Slug { get; set; }

        public bool IsActive { get; set; } = true;

        public int TenantId { get; set; }

        [InverseProperty("Page")]
        public List<Module> Modules { get; set; }

        public string ExtensionData { get; set; }
    }
}
