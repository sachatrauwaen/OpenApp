using System;
using System.Linq;

namespace Satrabel.OpenApp
{
    internal static class AppServiceHelper
    {
        #region BuildSortinginfo

        internal static Tuple<string, SortOrder> BuildSortinginfo(string sortingDefinition)
        {
            var sortingWords = sortingDefinition != null && sortingDefinition != "null"
                ? sortingDefinition.Split(" ")
                : new string[2];

            // determine sorting fields
            var sortingField = sortingWords[0] != null
                ? Capitalize(sortingWords[0]) // TODO deal with formatting of fields. Arango is case sensitive, but frond-end sends sorting field always not-capitalized
                : null;

            // determine sorting order
            var sortingOrder = sortingWords.Count() > 1 && sortingWords[1] == "DESC"
                ? SortOrder.DESC
                : SortOrder.ASC;

            // assemble sorting info
            var sortingInfo = sortingField == null
                ? null
                : Tuple.Create(sortingField, sortingOrder);

            return sortingInfo;
        }

        internal enum SortOrder
        {
            ASC,
            DESC
        }

        private static string Capitalize(string value)
        {
            return String.IsNullOrWhiteSpace(value)
                ? value
                : Char.ToUpper(value[0]) + value.Substring(1);
        }

        #endregion
    }
}
