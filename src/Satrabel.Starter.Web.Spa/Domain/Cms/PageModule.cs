using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Domain.Cms
{
    [Table("CmsPageModule")]
    public class PageModule: AuditedEntity, IPassivable, IExtendableObject
    {
        [ForeignKey(nameof(PageId))]
        public Page Page { get; set; }
        public int PageId { get; set; }

        [ForeignKey(nameof(ModuleId))]
        public Module Module { get; set; }
        public int ModuleId { get; set; }

        public bool IsActive { get; set; } = true;
        public string ExtensionData { get; set; }

        public string PaneName { get; set; }
        public int ModuleOrder { get; set; }
    }
}
