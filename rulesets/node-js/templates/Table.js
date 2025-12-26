// Minimal Table model — adapt as needed
class Column {
  constructor({ name, type, nullable = false, defaultValue = null }) {
    this.name = name;
    this.type = type;
    this.nullable = !!nullable;
    this.defaultValue = defaultValue;
  }
  toDefinition() {
    return `${this.name} ${this.type}${this.nullable ? ' NULL' : ' NOT NULL'}` + (this.defaultValue ? ` DEFAULT ${this.defaultValue}` : '');
  }
}

class Table {
  constructor({ name, columns = [] }) {
    this.name = name;
    this.columns = columns.map(c => new Column(c));
  }
  static fromRows(rows) {
    // rows: array of raw metadata rows — adapt mapping to your query shape
    const cols = rows.map(r => ({ name: r.column_name, type: r.data_type, nullable: r.is_nullable, defaultValue: r.column_default }));
    return new Table({ name: rows[0]?.table_name ?? 'unknown', columns: cols });
  }
  toCreateScript() {
    const defs = this.columns.map(c => c.toDefinition()).join(',\n  ');
    return `CREATE TABLE ${this.name} (\n  ${defs}\n);`;
  }
}

module.exports = { Column, Table };
