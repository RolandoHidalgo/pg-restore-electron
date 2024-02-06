import path from "path";
import fs from "fs";

const basePath64 = path.join('C:', 'Program Files', 'PostgreSQL');
const basePath86 = path.join('C:', 'Program Files (x86)', 'PostgreSQL');
const basePathsArch = [basePath64, basePath86];

const getVersions = (basePath) => {
    const arq = basePath.toString().includes('(x86)') ? 'x86' : '64';

    const dirs = fs.readdirSync(basePath);

    return dirs.map(e => {
        const pathToRestore = path.join(basePath, e, 'bin', 'pg_restore.exe');
        const exist = fs.existsSync(pathToRestore);
        return exist ? {arq, version: e, binary: pathToRestore} : null
    }).filter(o => o !== null);
};

const findBinarys = () => {
    console.log("el process desde el binary", process.argv);
    return basePathsArch.map(e => fs.existsSync(e) ? getVersions(e) : []).flat();


};

export {findBinarys};
