import { writeFile, readFile, lstat, Stats, writeFileSync, readFileSync, readdir } from "fs";
import { Dictionnary } from "./dictionnary/Dictionnary";
import generator from "./generator/generator";


enum type {file, dir, none}

function lstatasync(path: string): Promise<Stats> {
    return new Promise<Stats>((resolve, reject)=> {
        lstat(path, (err: NodeJS.ErrnoException, stats: Stats) => {
            if(err) reject(err);
            resolve(stats);
        });
    });
} 

async function checkPath(label: string): Promise<type> {
    try {
        const stats: Stats = await lstatasync(label);
        if (stats.isDirectory()) return type.dir;
        else if(stats.isFile()) return type.file;
        else return type.none;
    } catch (err) {
        return type.none
    }
}

function handleError(err: NodeJS.ErrnoException): void {
    console.error(err);
    process.exit(1);
}

function loadDic(path: string): Promise<Dictionnary> {
    return new Promise<Dictionnary>((resolve, reject) => {
        readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
            if(err) reject(err);
            resolve(Dictionnary.load(data.toString()));
        });
    })
}

function feedDic(dic: Dictionnary, inputFile: string): Promise<Dictionnary> {
    console.log("read file "+inputFile);
    return new Promise<Dictionnary>((resolve, reject) => {
        readFile(inputFile,(err: NodeJS.ErrnoException, data: Buffer) => {
            if (err) reject(err);
            dic.feedText(data.toString("utf-8"));
            resolve(dic);
        });
    });
}

function saveDic(dic: Dictionnary, path: string) :Promise<any> {
    return new Promise((resolve, reject) => {
        writeFile(path, new Buffer(Dictionnary.serialize(dic)),(err: NodeJS.ErrnoException) => {
            if (err) reject(err);
        });
        resolve(true);
    });
}

async function updateone (label: string, inputFile: string) {
    try {
        let dic: Dictionnary = await loadDic(label);
        dic = await feedDic(dic, inputFile);
        saveDic(dic, label);
    } catch(err) {
        handleError(err);
    }
}

function feedDicwithDir(dic: Dictionnary, inputDir: string): Promise<Dictionnary> {
    return new Promise<Dictionnary>(async (resolve, reject) => {
        readdir(inputDir, async (err: NodeJS.ErrnoException, files: string[]) => {
            if (err) reject(err);
            for (let file: string | undefined = files.pop(); file != undefined; file = files.pop()) {
                dic = await feedDic(dic, inputDir+file)
            }
            resolve(dic);
        });
    });
} 

async function updateall(label: string, inputDir: string) {
    console.log("updateall");
    try {
        let dic: Dictionnary = await loadDic(label);
        dic = await feedDicwithDir(dic, inputDir);
        saveDic(dic, label);
    }catch (err) {
        handleError(err);
    }
}

function generateWords(path: string, n: number): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
        const dic: Dictionnary = await loadDic(path);
        const gen: generator = new generator(dic.getTransitionMatrix());
        resolve(gen.compute(n))
    });
}

async function create(label: string, inputFile: string) {
    try {
        const start: number = new Date().getTime();
        const labelType: type = await checkPath(label);
        if (labelType == type.dir) usages();
        else if (labelType == type.none) writeFileSync(label,"[]");

        const inputType: type = await checkPath(inputFile);
        console.log(inputType == type.file);
        if (inputType == type.file) await updateone(label, inputFile);
        else if(inputType == type.dir) await updateall(label, inputFile);
        else usages();
        const end: number = new Date().getTime();
        console.log("compute in "+(end-start)+" milliseconds");
    }catch (err) {
        handleError(err);
    }
}

async function generate(label: string, n: number) {
    const start: number = new Date().getTime();
    const labelType: type = await checkPath(label);
    if (labelType == type.dir) usages();
    else if (labelType == type.none) usages();
    if(! n) n = 1;

    const res: string[] = await generateWords(label, n);
    res.forEach(val => console.log(val));
    const end: number = new Date().getTime();
    console.log("compute in "+(end-start)+" milliseconds");
    
}

function usages() {
    const message: string = 
    "create <dicFile> <inputFile | inputDirectory> -> create a new dictionnary\n"
    + "update <dicFile> <inputFile | inputDirectory> -> add words of input file to the dictionnary matching label\n"
    + "generate <dicFile> <n> -> generate n words with the dictionary matches label\n"
    + "help -> display this help";
    console.log(message);
    process.exit(0);
}

async function main() {
    const cmd: string = process.argv[2];
    switch (cmd) {
        case "create": {
            create(process.argv[3], process.argv[4]);
            break;
        }
        case "update": {
            create(process.argv[3], process.argv[4]);
            break;
        }
        case "generate": {
            generate(process.argv[3], parseInt(process.argv[4]))
            break;
        }
        case "help": {
            usages();
            break;
        }
    }    
}

main();