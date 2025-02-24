import fs, { read } from "fs";
import util from "util";

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

export async function readJSONFile(filepath) {
    let resolve;
    const promise = new Promise(r => resolve = r);

    readFileAsync(filepath).then(buffer => {
        const string = buffer.toString("utf8");
        
        try {
            const parsed = JSON.parse(string);

            resolve({
                error: null,
                data: parsed
            });
        } catch(err) {
            resolve({
                error: err,
                data: null
            });
        }
    }).catch(error => {
        resolve({
            error,
            data: null
        });
    });

    return await promise;
}

export async function readStringFile(filepath) {
    let resolve;
    const promise = new Promise(r => resolve = r);

    readFileAsync(filepath).then(buffer => {
        const string = buffer.toString("utf8");

        resolve({
            error: null,
            data: string
        });
    }).catch(error => {
        resolve({
            error,
            data: null
        });
    });

    return await promise;
}

export async function writeStringFile(contents, filepath) {
    let resolve;
    const promise = new Promise(r => resolve = r);

    writeFileAsync(filepath, contents).then(() => {
        resolve({
            success: true,
            error: null
        });
    }).catch(error => {
        resolve({
            success: false,
            error
        });
    });

    return await promise;
}