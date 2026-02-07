import sqlite from 'sqlite'
import { open } from 'sqlite'
import { Collection, Column, ColumnDefinition, Database, DBDriver, DBParams, Join, Query, Where } from './db.types';

type SQLiteValidator<T> = (value: T | any)=>boolean

enum SQLiteConditions {
    EQ = "=",
    IN = "IN",
    NOT = "NOT",
    GTE = "<=",
    LTE = ">=",
    NE = "!=",
    MT = ">",
    LT = "<",
    LIKE = "LIKE"
    //GLOB
};

enum SQLiteConditionJoiners {
    BT = "BETWEEN",
    AND = "AND",
    OR = "OR"
};

enum SQLiteConditionSolos {
    NUL = "IS NULL",
    NNU = "IS NOT NULL"
};

class SQLiteColumn<T> implements Column<T> {
    name: string;
    primary: boolean;
    restrictions: string[];
    type: SQLiteValidator<T>;
    constructor(name: string | any, validator: SQLiteValidator<T>, primary: boolean, ...restrictions: string[]) {
        this.name = `${name}`,
        this.primary = primary,
        this.restrictions = restrictions;
        this.type = validator;
    }
};

class SQLiteDB implements Database {
    table: (name: string) => Table;
    from: (name: string) => Table;
    exec(query: string, ...criteria: string[]): Promise<QueryStatus<Collection>>;
    exec(query: string): Promise<QueryStatus<Collection>>;
    exec(query: SkeletonQuery, criteria?: string[]): Promise<QueryStatus<Collection>>;
    exec(query: string | SkeletonQuery, criteria?: unknown, ...rest?: unknown[]): Promise<import("./db.types").QueryStatus<Collection>> {
    }

    createTable(query: DefinitionSkeletonQuery): Promise<QueryStatus<Table>>;
    createTable(query: string, ...description: ColumnDefinition[]): DefinitionSkeletonQuery;
    createTable(query: string): DefinitionSkeletonQuery;
    createTable(query: unknown, ...rest?: unknown[]): import("./db.types").DefinitionSkeletonQuery | Promise<QueryStatus<Table>> {
    }
}

class SQLiteWhere implements Where {
    text: string;

};

class SQLiteJoin implements Join {
    table: string;
    on: SQLiteWhere;
    addOn(on: Where): Join;
    addOn(on: string): Join;
    addOn(...on: string[]): Join;
    addOn(on?: unknown, ...rest?: unknown[]): Join {

    }
    constructor(table: string, ...on: SQLiteWhere) {
    }
};

class SQLiteQuerySerialiser {

}

class SQLiteQuery implements Query {
    text: string;
    database: SQLiteDB;
    table?: SQLiteTable;
    criteria?: SQLiteWhere;
    join?: SQLiteJoin;
    returned?: number;
}

class SQLiteDiver implements DBDriver {
    version = "0.1";
    open(params: DBParams){
    }
}

export {};