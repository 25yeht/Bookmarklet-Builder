import { readJSONFile, readStringFile, writeStringFile } from "./files.js";
import { buildScript } from "./build.js";

import path from "path";

const toBuildDirectory = process.argv[2];

if(!toBuildDirectory) {
    console.log("Please specify a build directory!");
    process.exit(1);
}

const srcJSONPath = path.join(toBuildDirectory, "src");
const distJSONPath = path.join(toBuildDirectory, "dist");

const metadataJSONPath = path.join(srcJSONPath, "bookmarklet.json");
const metadataRead = await readJSONFile(metadataJSONPath);

if(metadataRead.error) {
    console.error(`Unable to read the bookmarklet metadata at ${metadataJSONPath}:\n\n`, metadataRead.error);
    process.exit(1);
}

// Begin parsing metadata

const requiredKeys = {
    "masterScript": "string"
};

const metadata = metadataRead.data;
const metadataKeys = Object.keys(metadata);

for(const [ key, value ] of Object.entries(requiredKeys)) {
    if(!metadataKeys.includes(key)) {
        console.log(`Required key ${key} not found. Please check your bookmarklet.json`);
        process.exit(1);
    } else if(typeof metadata[key] !== value) {
        console.log(`Key ${key} is type ${typeof metadata[key]}. Expected ${requiredKeys[key]}.`);
        process.exit(1);
    }
}

const masterScriptPath = path.join(srcJSONPath, metadata.masterScript);

const scriptBuildOutputPath = path.join(distJSONPath, "build.js");

console.log(`Building script and outputting to ${scriptBuildOutputPath} ...`);

const builtScriptData = await buildScript(masterScriptPath);

if(builtScriptData.error) {
    console.error("Error building script:\n\n", builtScriptData.error);
    process.exit(1);
}

const distScriptWrite = await writeStringFile(builtScriptData.data, scriptBuildOutputPath);

if(!distScriptWrite.success) {
    console.error(`Error writing built script to ${scriptBuildOutputPath}:\n\n`, distScriptWrite.error);
    process.exit(1);
}

console.log(`Success! Your bookmarklet has been built and outputted to ${scriptBuildOutputPath} !`);