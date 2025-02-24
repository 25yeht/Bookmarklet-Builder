import { readStringFile } from "./files.js";

function error(err) {
    return {
        error: err
    };
}

export async function buildScript(masterScriptPath) {
    const masterScriptRead = await readStringFile(masterScriptPath);

    if(masterScriptRead.error) {
        console.error(`Unable to read the master script at ${masterScriptPath}:\n\n`, masterScriptRead.error);
        return error(masterScriptRead.error);
    }

    return {
        data: "wow"
    };
}