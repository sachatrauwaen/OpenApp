using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Satrabel.Starter.Web.Domain.Cms
{
    [Table("CmsModule")]
    public class Module: FullAuditedEntity, IPassivable, IExtendableObject
    {
        [ForeignKey(nameof(PageId))]
        public Page Page { get; set; }
        public int PageId { get; set; }

        public bool IsActive { get; set; } = true;
        public string ExtensionData { get; set; }
    }
}
