import { begin, end } from "../consts";

export default class generator {
    private matrix: Map<string, Map<string, number>>;

    constructor (matrix: Map<string, Map<string, number>>) {this.matrix = matrix; }

    public updateMatrix(matrix: Map<string, Map<string, number>>) {this.matrix = matrix;}

    private getCorresponding(i: number, row: Map<string, number> | undefined): string {
        if(undefined == row) return "";
        let cumulativePercentage: number = 0;
        for (let entry of row.entries()) {
            cumulativePercentage += entry["1"];
            if (i < cumulativePercentage) return entry["0"];
        }
        return "";
    }

    private createWord(): string {
        let state: string = begin
        let cur: string = "";
        let res: string = "";
        while (cur != end) {
            res += cur;
            let random = Math.random()*100;
            let newchar: string = this.getCorresponding(random, this.matrix.get(state+cur));
            if ("" == newchar) return "";
            if ("" != cur) state = cur;
            cur = newchar;
        }
        return res;
    }

    public compute(n: number): string[] {
        let res: Array<string> = new Array()
        for (let i = 0; i < n; ++i) {
            res.push(this.createWord());
        }
        return res.sort();
    }

}