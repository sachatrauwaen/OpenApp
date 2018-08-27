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
    public class Module: FullAuditedEntity, IExtendableObject, IMultiLingualEntity<ModuleTranslation>
    {
        [InverseProperty("Module")]
        public List<PageModule> PageModules { get; set; }

        public string ExtensionData { get; set; }
        public ICollection<ModuleTranslation> Translations { get ; set ; }
    }
}
