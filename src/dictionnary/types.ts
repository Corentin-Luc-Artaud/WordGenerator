export class TransitionsMap extends Map<string, Map<string, number>>{}

export interface formatter {
    format(input: string) : string[];
}
