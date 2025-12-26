// Minimal TypeScript Table model — adapt as needed
export class Column {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: any;
  constructor({ name, type, nullable = false, defaultValue = null }: any) {
    this.name = name;
    this.type = type;
    this.nullable = !!nullable;
    this.defaultValue = defaultValue;
  }
  toDefinition(): string {
    return `${this.name} ${this.type}${this.nullable ? ' NULL' : ' NOT NULL'}` + (this.defaultValue ? ` DEFAULT ${this.defaultValue}` : '');
  }
}

export class Table {
  name: string;
  columns: Column[];
  constructor({ name, columns = [] }: any) {
    this.name = name;
    this.columns = columns.map((c: any) => new Column(c));
  }
  static fromRows(rows: any[]): Table {
    const cols = rows.map(r => ({ name: r.column_name, type: r.data_type, nullable: r.is_nullable, defaultValue: r.column_default }));
    return new Table({ name: rows[0]?.table_name ?? 'unknown', columns: cols });
  }
  toCreateScript(): string {
    const defs = this.columns.map(c => c.toDefinition()).join(',\n  ');
    return `CREATE TABLE ${this.name} (\n  ${defs}\n);`;
  }
}
