import { DatabaseTables, DatabaseFunctions } from "./Database";
import { SupabaseClient } from "@supabase/supabase-js";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface TableStatement<TableName extends keyof DatabaseTables> {
  name: TableName;
  select<Return extends object>(relatedSelects: GetRelatedSelects<Return>): SelectStatement<TableName, Return>;
  select<Return extends object>(
    select: string,
    relatedSelects: GetRelatedSelects<Return>,
  ): SelectStatement<TableName, Return>;
}
export interface SelectStatement<TableName extends keyof DatabaseTables, Return extends object> {
  tableName: TableName;
  select: string;
  toString(): string;
  __infer(value: Return): Return;
  multiple: SelectStatement<TableName, Return[]>;
}

type GetRelatedSelects<T extends object> = {
  [N in keyof T as T[N] extends object ? N : never]: T[N] extends object
    ? SelectStatement<any, T[N]> | keyof DatabaseFunctions
    : never;
};

type CoerceObj<T> = { [N in keyof T]: T[N] };

export type FilterFunc<TableName extends keyof DatabaseTables> = (
  builder: PostgrestFilterBuilder<any, CoerceObj<DatabaseTables[TableName][number]>, any>,
) => void;

export function from<TableName extends keyof DatabaseTables>(tableName: TableName): TableStatement<TableName> {
  function select<Return extends object>(
    selectStatement?: string | GetRelatedSelects<Return>,
    relatedSelects?: GetRelatedSelects<Return>,
  ): SelectStatement<TableName, Return> {
    if (typeof selectStatement === "object") {
      relatedSelects = selectStatement;
      selectStatement = "*";
    } else {
      selectStatement ??= "*";
    }
    if (typeof relatedSelects === "object") {
      const related = Object.entries(relatedSelects).map(([name, select]) => `, ${name}: ${select}`);
      selectStatement += related.join("");
    }
    const statement = {
      tableName,
      select: selectStatement,
      toString: () => `${tableName}(${selectStatement})`,
      __infer: undefined as never,
      multiple: undefined as never,
    } as SelectStatement<TableName, Return>;

    statement.__infer = v => v;
    statement.multiple = statement as SelectStatement<TableName, Return[]>;

    return statement;
  }

  return { name: tableName, select };
}

export class WrappedSupabaseClient {
  public constructor(public readonly Supabase: SupabaseClient) {}

  public selectOne<TableName extends keyof DatabaseTables, Return extends object>(
    statement: SelectStatement<TableName, Return>,
    filter: FilterFunc<TableName>,
  ): Promise<Return | null> {
    const builder = this.Supabase.from(statement.tableName).select<any, DatabaseTables[TableName][number]>(
      statement.select,
    );
    filter(builder);
    return builder
      .maybeSingle()
      .throwOnError()
      .then(res => res.data!) as Promise<Return>;
  }
  public selectMany<TableName extends keyof DatabaseTables, Return extends object>(
    statement: SelectStatement<TableName, Return>,
    filter: FilterFunc<TableName>,
    limit?: number | [start: number, end: number],
  ): Promise<Return[]> {
    const builder = this.Supabase.from(statement.tableName).select<any, DatabaseTables[TableName][number]>(
      statement.select,
    );
    filter(builder);
    if (typeof limit === "number") {
      builder.limit(limit);
    } else if (Array.isArray(limit)) {
      builder.range(...limit);
    }
    return builder.throwOnError().then(res => res.data ?? []) as Promise<Return[]>;
  }

  public rpc<FunctionName extends keyof DatabaseFunctions>(
    functionName: FunctionName,
    args: Parameters<DatabaseFunctions[FunctionName]>[0],
    abort?: AbortSignal,
  ): Promise<ReturnType<DatabaseFunctions[FunctionName]>> {
    let builder = this.Supabase.rpc(functionName, args as any);
    if (abort) builder = builder.abortSignal(abort);
    return builder.throwOnError().then(res => res.data) as Promise<ReturnType<DatabaseFunctions[FunctionName]>>;
  }
}
