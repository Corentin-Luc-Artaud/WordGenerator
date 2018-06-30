import "mocha"
import { expect } from "chai";
import { Dictionnary } from "./Dictionnary";


describe("Dictionnary", () => {
    it("should have only one \"bonjour\" in the dictionnary", () => {
        const dic: Dictionnary = new Dictionnary();

        dic.feedLine("bonjour Bonjour BONJOUR");
        expect(dic.getWords().size).to.be.equals(1);
    });

    it("should have transitions count of \"bonjour\" equals to one", () => {
        const dic: Dictionnary = new Dictionnary();

        dic.feedLine("bonjour Bonjour BONJOUR");
        const res = dic.getTransitions();
        for (let entry of res.values()) {
            for (let value of entry.values()) {
                expect(value).to.be.equals(1);
            }
        }
    });

    it("should return false if dic not equals another", () => {
        const dic1: Dictionnary = new Dictionnary();
        dic1.feedLine("bonjour Bonjour BONJOUR");

        const dic2: Dictionnary = new Dictionnary();
        expect(dic1.equals(dic2)).to.be.false;
    });

    it("should obtain the same object after deserialize the serialize object", () => {
        const dic: Dictionnary = new Dictionnary();

        dic.feedLine("bonjour Bonjour BONJOUR");
        expect(Dictionnary.load(Dictionnary.serialize(dic)).equals(dic)).to.be.true;
    });
});