import { ProgId, Regedit, ShellOption } from "electron-regedit";


import fs from "node:fs";

import path from "node:path";



const writeChekFile = () => {

  try {
    fs.writeFileSync(getCheckFilePaht(), "true");
    // file written successfully
  } catch (err) {
    console.error(err);
  }
};


const isFisrtRun = () => {


  try {

    return !fs.existsSync(getCheckFilePaht());
    // file written successfully
  } catch (err) {
    console.error(err);
  }
  return false;
};

const getCheckFilePaht = () => {

  const val = path.join(path.dirname(process.argv[0]), "apprun.info");

  return val;
};

const squirrelStartupEvent = () => {

  if (process.platform !== "win32" || process.env.WEBPACK_DEV_SERVER_URL) {

    return false;
  }

  if (isFisrtRun()) {

    //... instantiate your ProgIds
    const progId = new ProgId({
      description: "Restaurar PostgreSQl .backup files",
      extensions: ["backup"],
      friendlyAppName: true,
      squirrel: false,
      icon: "./pg-restore-vite.exe",
      progExt: "backup",
      shell: [new ShellOption({
        verb: ShellOption.OPEN,
        icon: "./pg-restore.exe"
      }), new ShellOption({ verb: ShellOption.EDIT, args: ["--edit"] }), new ShellOption({
        verb: "customaction", args: ["--custom"], action: "Awesome Action"
      })]
    });

    progId.install().then((e) => {

    });

    Regedit.installAll().then((e) => {

    });
    writeChekFile();
  }

  return true;
};

const handleSquirell = () => {

  const handle = squirrelStartupEvent();
  if (handle) {
    //app.quit();
  }

};
export { handleSquirell };
