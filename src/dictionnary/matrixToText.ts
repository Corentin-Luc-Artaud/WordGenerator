import { json } from "express";

function serializeRow(row: Map<string, number>): string {
    return JSON.stringify(Array.from(row));
}


export function serializeMatrix(matrix: Map<string, Map<string, number>>): string {
    let res: [string, string][] = new Array();
    matrix.forEach((value: Map<string, number>, key: string) => {
        let row = serializeRow(value);
        res.push([key, row]);
    });
    return JSON.stringify(res);
}

function deserializeRow(row: string): Map<string, number> {
    return new Map(JSON.parse(row));
}

export function deserialiseMatrix(text: string):  Map<string, Map<string, number>> {
    let res: Map<string, Map<string, number>> = new Map();
    let temp: Map<string, string> = new Map(JSON.parse(text));
    temp.forEach((value: string, key: string) => {
        res.set(key, deserializeRow(value));
    });
    return res;
}