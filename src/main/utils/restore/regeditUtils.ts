import { ProgId, Regedit, ShellOption } from "electron-regedit";


import fs from "node:fs";

import path from "node:path";

console.log("sadasdasdasd");

const writeChekFile = () => {
  console.log("sadasdasdasd");
  try {
    fs.writeFileSync(getCheckFilePaht(), "true");
    // file written successfully
  } catch (err) {
    console.error(err);
  }
};


const isFisrtRun = () => {


  try {
    console.log("is first??");
    return !fs.existsSync(getCheckFilePaht());
    // file written successfully
  } catch (err) {
    console.error(err);
  }
  return false;
};

const getCheckFilePaht = () => {
  console.log("check");
  const val = path.join(path.dirname(process.argv[0]), "apprun.info");
  console.log(val);
  return val;
};

const squirrelStartupEvent = () => {
  console.log("squirelllllllll");
  if (process.platform !== "win32" || process.env.WEBPACK_DEV_SERVER_URL) {
    console.log("no instalar");
    return false;
  }

  if (isFisrtRun()) {
    console.log("a instalarrrrrrrr");
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
      console.log("el progId installed", e);
    });

    Regedit.installAll().then((e) => {
      console.log("all process installed", e);
    });
    writeChekFile();
  }

  return true;
};

const handleSquirell = () => {
  console.log("handleeeeee");
  const handle = squirrelStartupEvent();
  if (handle) {
    //app.quit();
  }

};
export { handleSquirell };
