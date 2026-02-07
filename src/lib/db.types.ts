type Restriction = string;

type Validator<T> = (value: T | any)=>boolean

interface Column<T> {
    name: string,
    type: Validator<T>,
    primary: boolean,
    restrictions: Restriction[]
};

interface Where {
    text: string,
    vone: string,
    vtwo?: string
    condition: string,
    extra?: Where,
    extraHow?: string
};

interface Join {
    table: string,
    on: Where,
    addOn(on: Where): Join
    addOn(on: string): Join
    addOn(...on: string[]): Join
};

interface Query {
    text: string,
    database: Database,
    table?: Table,
    criteria?: Where,
    returned?: number
};

type Row = Record<string, any>;
type Collection = Row[];

interface SkeletonQuery {
    text: string,
    database: Database,
    table?: Table,
    criteria: Where,
    data?: Collection,
    eq: (v1: any,v2: any)=>SkeletonQuery,
    exec: ()=>Promise<QueryStatus<Table>>
};

interface Description {
    name: string,
    size: BigInt,
};

type ColumnDefinition = Record<string, Column<any>>;
interface TableDescription extends Description {
    columns: ColumnDefinition[]
};

interface DBDescription extends Description {
    tables: Record<string, Table>[]
};

interface DefinitionSkeletonQuery {
    text: string,
    database: Database,
    tableName: string,
    description: TableDescription,
    exec: ()=>Promise<QueryStatus<Table>>
}

interface QueryStatus<T> {
    query: Query,
    status: number,
    message: string,
    data: T | null,
    metadata: {
        description: Description
    }
    error: Error | null
};

interface Table {
    select(rows: string): SkeletonQuery,
    select(...rows: string[]): SkeletonQuery,
    select(rows: string, criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    select(rows: string[], criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    select(rows: string, ...criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    select(rows: string[], ...criteria: Restriction[]): Promise<QueryStatus<Collection>>,

    insert(...rows: Collection): Promise<QueryStatus<Collection>>,
    insert(rows: string): Promise<QueryStatus<Collection>>,
    insert(rows: Record<string,Row | any[]>): Promise<QueryStatus<Collection>>,
    insert(row: Row): Promise<QueryStatus<Collection>>,

    update(set: Row): SkeletonQuery,
    update(rows: Record<string,Row | any[]>): Promise<QueryStatus<Collection>>,
    update(set: Row, ...criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    update(set: Row, criteria: Restriction[]): Promise<QueryStatus<Collection>>,

    delete(): SkeletonQuery,
    delete(...criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    delete(criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    truncate: ()=>SkeletonQuery,
};

interface Database {
    table: (name: string)=>Table,
    from: (name: string)=>Table
    exec(query: string, ...criteria: Restriction[]): Promise<QueryStatus<Collection>>,
    exec(query: string): Promise<QueryStatus<Collection>>,
    exec(query: SkeletonQuery, criteria?: Restriction[]): Promise<QueryStatus<Collection>>,
    createTable(query: DefinitionSkeletonQuery): Promise<QueryStatus<Table>>,
    createTable(query: string, ...description: ColumnDefinition[]): DefinitionSkeletonQuery,
    createTable(query: string): DefinitionSkeletonQuery,
};

interface DBParams {
    user: string,
    password: string,
    host?: string,
    port?: number
};

interface DBDriver {
    open(params: DBParams): Promise<QueryStatus<Table>>,
    open(user: string, password: string, host?: string, port?: number): Promise<QueryStatus<Table>>,
    version: string
};

export type {
    Column, Query, Where, Join, Row, Collection, SkeletonQuery, ColumnDefinition, TableDescription, DBDescription, DefinitionSkeletonQuery, QueryStatus, Table, Database, DBParams, DBDriver
};