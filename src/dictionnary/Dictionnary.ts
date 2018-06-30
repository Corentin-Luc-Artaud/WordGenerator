import { TransitionsMap, formatter } from "./types";
import wordsAnalyser from "./wordAnalyser";

const splitter = /[ \^\n\r\t'’"«»=+,\.;:\?\!\*%\-_()[\]{}0-9]/;

export class Dictionnary {
    private transitions: TransitionsMap;
    private words: Set<string>;

    constructor() {
        this.transitions = new TransitionsMap();
        this.words = new Set();
    }

    feedLine(line: string): void {
        const analyser: wordsAnalyser = new wordsAnalyser(this.transitions); 
        line.split(splitter).filter((value: string): boolean => {
            return value.length > 1;
        }).forEach((word: string): void => {
            word = word.toLowerCase();
            if(! this.words.has(word)) {
                this.words.add(word);
                analyser.wordAnalyse(word);
            }
        });
    }

    feedText(text: string): void {
        text.split(/\r?\n/).forEach((line: string) => {
            this.feedLine(line);
        });
    }

    
    public getTransitions() : TransitionsMap {
        return this.transitions;
    }
    
    public getWords(): Set<string> {
        return this.words;
    }

    public getTransitionMatrix(): TransitionsMap {
        return new wordsAnalyser(this.transitions).getTransitionMatrix();
    }

    public equals(dic: Dictionnary): boolean {
        if (this.words.size != dic.words.size) return false;
        this.words.forEach((value: string) => {
            if (! dic.words.has(value)) return false;
        });
        return true;
    }

    public static serialize(dic: Dictionnary): string {
        let res: string = "";
        res += JSON.stringify(Array.from(dic.words).sort());
        return res;
    } 

    public static load(dic: string): Dictionnary {
        let res: Dictionnary = new Dictionnary();
        const values: Set<string> = JSON.parse(dic);
        values.forEach((value) => res.feedLine(value));
        return res;
    }

 

}