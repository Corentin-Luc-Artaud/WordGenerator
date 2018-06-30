import "mocha"
import { expect } from "chai";
import wordsAnalyser from "../dictionnary/wordAnalyser";
import {serializeMatrix, deserialiseMatrix}  from "./matrixToText";
import { begin, end } from "../consts";


describe("matrix to text", () => {
    it("should be reversed",() => {
        let analyser:wordsAnalyser = new wordsAnalyser(undefined);
        analyser.wordAnalyse("bonjour");
        let serialized: string = serializeMatrix(analyser.getTransitionMatrix());

        let res = deserialiseMatrix(serialized);

        let beginTrans = res.get(begin);
        expect(beginTrans).to.be.not.undefined;
        expect(beginTrans != undefined ? beginTrans.get('b') || 0: 0).to.be.equals(100);

        let beginBTrans = res.get(begin+"b");
        expect(beginBTrans).to.be.not.undefined;
        expect(beginBTrans != undefined ? beginBTrans.get('o') || 0: 0).to.be.equals(100);
    
        let boTrans = res.get("bo");
        expect(boTrans).to.be.not.undefined;
        expect(boTrans != undefined ? boTrans.get('n') || 0: 0).to.be.equals(100);

        let onTrans = res.get("on");
        expect(onTrans).to.be.not.undefined;
        expect(onTrans != undefined ? onTrans.get('j') || 0: 0).to.be.equals(100);

        let njTrans = res.get("nj");
        expect(njTrans).to.be.not.undefined;
        expect(njTrans != undefined ? njTrans.get('o') || 0: 0).to.be.equals(100);

        let joTrans = res.get("jo");
        expect(joTrans).to.be.not.undefined;
        expect(joTrans != undefined ? joTrans.get('u') || 0: 0).to.be.equals(100);

        let ouTrans = res.get("ou");
        expect(ouTrans).to.be.not.undefined;
        expect(ouTrans != undefined ? ouTrans.get('r') || 0: 0).to.be.equals(100);

        let urTrans = res.get("ur");
        expect(urTrans).to.be.not.undefined;
        expect(urTrans != undefined ? urTrans.get(end) || 0: 0).to.be.equals(100);

    });
})