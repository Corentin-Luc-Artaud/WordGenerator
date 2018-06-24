import "mocha"
import { expect } from "chai";
import wordsAnalyser from "../matrixCompiler/wordAnalyser";
import generator from "./generator";

describe("generator", () => {
    it("should always return bonjour", () => {
        let analyser: wordsAnalyser = new wordsAnalyser();
        analyser.wordAnalyse("bonjour");

        let gen = new generator(analyser.getTransitionMatrix());
        let res:string[] = gen.compute(100);
        res.forEach((elem) => {
            expect(elem).to.be.equals("bonjour");
        });
       
    });

    function areAllTransitionsInDefinition(definition: string[], word: string):boolean {
        Array.from(word).forEach((value: string, index: number, array: string[]) =>{
            let token = "";
            if (index < 1) token = value;
            else if (index < 2) token = array[index-1]+value;
            else  token = array[index-2]+array[index-1]+value;
            let iscontain = false;
            definition.forEach((def) => {
                if (def.includes(token)) iscontain = true;
            });
            if (! iscontain) return false;
        });
        return true;
    }

    it("every transition should be contains inside a word", () => {
        const words: string[] = ["bonjour", "comment", "allez", "vous", "aujourd","hui", "content", "être", "ici", "bas", "abdiquer", "nous", "devons", "dit", "le", "roi", "en", "ce", "jeudi"];
        let analyser: wordsAnalyser = new wordsAnalyser();
        analyser.analyseWords(words);

        let gen = new generator(analyser.getTransitionMatrix());
        let res: string[] = gen.compute(300);
        res.forEach((elem) => {
            expect(areAllTransitionsInDefinition(words, elem)).to.be.true;
        });
    });

    it("should return nothing if matrix is empty", () => {
        let analyser: wordsAnalyser = new wordsAnalyser();
        let gen = new generator(analyser.getTransitionMatrix());
        let emptyRes:string[] = gen.compute(100);
        emptyRes.forEach((elem) => {
            expect(elem).to.be.equals("");
        });

        analyser.wordAnalyse("bonjour");

        gen.updateMatrix(analyser.getTransitionMatrix());
        let res:string[] = gen.compute(100);
        res.forEach((elem) => {
            expect(elem).to.be.equals("bonjour");
        });
    });
});