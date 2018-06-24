import {end, begin} from "../consts"

/**
 * analyze words and create a transition matrix
 */
export default class wordsAnalyser {
    private markovMatrix: Map<string, Map<string, number>>

    constructor () {
        this.markovMatrix = new Map();
    }

    /**
     * 
     */
    public analyseWords(words: Array<string>): void {
        words.forEach(word => {
            this.wordAnalyse(word);
        });
    }

    /**
     * 
     * @param value 
     * @param index 
     * @param array 
     * @returns the key composed of the two previous char
     */
    private defineKey (value: string, index: number, array: string[]): string {
        let key: string = "";
        if(index < 1) key +=begin;
        else if(index < 2) key = begin+array[index-1];
        else key = array[index-2]+array[index-1];
        return key;
    }

    /**
     * 
     * @param key 
     * @returns the matrix corresponding to the key or create one and returns it
     */
    private getRow(key: string): Map<string, number> {
        let row: Map<string, number> | undefined;
        row = this.markovMatrix.get(key);
        if (row == undefined) {                 // if there is no map corresponding to the key
            row = new Map();                    // create a new one
            this.markovMatrix.set(key, row);    // and add it at the right place to the map
            return row;
        } else return row;
    }

    /**
     * add one to the transition to end
     * @param value 
     * @param index 
     * @param array 
     */
    private lastChar(value: string, index: number, array: string[]):void {
        let key: string = array[index-1]+value;
        let row: Map<string, number> = this.getRow(key);
        row.set(end, (row.get(end) || 0)+1);
    }

    /**
     * 
     * @param word 
     * for each char of word fill the corresponding map
     */
    public wordAnalyse(word: string):void {
        Array.from(word).forEach((value: string, index: number, array: string[]) =>{
            let key : string = this.defineKey(value, index, array); 
            let row: Map<string, number>  = this.getRow(key);
            row.set(value, (row.get(value) || 0)+1);
            if(array.length-1 == index) this.lastChar(value, index, array); // if it's the last char of word add 1 to end transition
        });
    }

    
    /**
     * @returns the transition map with percent of each transition per couples of chars
     */
    public getTransitionMatrix(): Map<string, Map<string, number>>{
        let res: Map<string, Map<string, number>> = new Map();
        this.markovMatrix.forEach((entry: Map<string, number>, key: string) => {
            let row:Map<string, number> = new Map();
            let total: number = 0;
            for (let value of entry.values()) {
                total += value;
            }
            entry.forEach((value: number, next: string) => {
                row.set(next, value*100/total);
            });
            res.set(key, row)
        });
        return res;
    }
}

