using System.Collections.Generic;

namespace DevRules.Models
{
    public class Column
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public bool Nullable { get; set; }
        public string DefaultValue { get; set; }

        public string ToDefinition() => $"{Name} {Type}{(Nullable ? " NULL" : " NOT NULL")}{(string.IsNullOrEmpty(DefaultValue) ? "" : " DEFAULT " + DefaultValue)}";
    }

    public class Table
    {
        public string Name { get; set; }
        public List<Column> Columns { get; set; }

        public string ToCreateScript()
        {
            var defs = string.Join(",\n  ", Columns.ConvertAll(c => c.ToDefinition()));
            return $"CREATE TABLE {Name} (\n  {defs}\n);";
        }
    }
}
