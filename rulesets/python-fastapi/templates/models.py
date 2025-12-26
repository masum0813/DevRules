from pydantic import BaseModel
from typing import Optional, List, Any


class Column(BaseModel):
    name: str
    type: str
    nullable: bool = False
    default: Optional[Any] = None


class Table(BaseModel):
    name: str
    columns: List[Column]

    @classmethod
    def from_rows(cls, rows: List[dict]):
        cols = [Column(name=r.get('column_name'), type=r.get('data_type'), nullable=r.get('is_nullable'), default=r.get('column_default')) for r in rows]
        return cls(name=rows[0].get('table_name') if rows else 'unknown', columns=cols)

    def to_create_script(self) -> str:
        defs = ',\n  '.join([f"{c.name} {c.type}{' NULL' if c.nullable else ' NOT NULL'}{(' DEFAULT ' + str(c.default)) if c.default is not None else ''}" for c in self.columns])
        return f"CREATE TABLE {self.name} (\n  {defs}\n);"
