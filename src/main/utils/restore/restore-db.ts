import IpcMainEvent = Electron.IpcMainEvent;
import {BrowserWindow, Notification} from "electron";
import {spawn} from "child_process";
import path from "node:path";

type DbOtions = {
  dbName: string;
  port: string;
  host: string;
  backupPath?: string;
  user: string;
  password: string;
  binary: string;

}

type CreateDebOptions = {
  name: string
  encoding: string
  template: string
  collate: string
  ctype: string
  tablespace: string
}
const restoreDb = (dbOptions: DbOtions, event: IpcMainEvent) => {
  const {dbName, host, password, port, user, backupPath, binary} = dbOptions;

  //const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
  const params = `--host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName} --verbose`;


  const paramsSplitted = params.toString().split(" ");
  paramsSplitted.push(path.normalize(backupPath));


  console.log(binary, paramsSplitted.join(" "));

  const bat = spawn(binary, paramsSplitted, {env: {...process.env, PGPASSWORD: password}});
  getBrowserWindow(event)?.setProgressBar(2);
  bat.stdout.setEncoding("utf8");
  bat.stdout.on("data", (data: any) => {
    console.log("data", data.toString());
    event.sender.send("restore-logs", data.toString());
  });
  bat.stderr.setEncoding("utf8");
  bat.stderr.on("data", (data: any) => {
    console.log("error", data.toString());
    event.sender.send("restore-logs", data.toString());
  });

  bat.on("exit", (code: any) => {
    console.log(`Child exited with code ${code}`);
    event.sender.send("restore-logs", `finish-OK`);
  });
  bat.on("error", (code: any) => {
    console.log(`error ${code}`);
    event.sender.send("restore-logs", `error ${code}`);
  });
};


const createDb = (dbOptions: DbOtions,createDbOptions:CreateDebOptions, event: IpcMainEvent) => {

  const {dbName, host, password, port, user, binary} = dbOptions;

  //const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
  let params = `--host ${host} --port ${port} --username ${user}`;

  if (createDbOptions?.encoding) {
    params += ` --encoding ${createDbOptions.encoding}`
  }
  if (createDbOptions?.ctype) {
    params += ` --lc-ctype ${createDbOptions.ctype}`
  }
  if (createDbOptions?.tablespace) {
    params += ` --tablespace ${createDbOptions.tablespace}`
  }
  if (createDbOptions?.collate) {
    params += ` --lc-collate ${createDbOptions.collate}`
  }
  if (createDbOptions?.template) {
    params += ` --template ${createDbOptions.template}`
  }

  params+= ` ${dbName}`

  const paramsSplitted = params.toString().split(" ");

  const exe = path.join(path.dirname(binary),'createdb.exe');
  console.log( exe,paramsSplitted.join(" "));
  console.log(createDbOptions);

  const bat = spawn(exe, paramsSplitted, { env: { ...process.env, PGPASSWORD: password } });
  getBrowserWindow(event)?.setProgressBar(2);

  bat.stdout.setEncoding("utf8");

  bat.stdout.on("data", (data: any) => {
    console.log("data", data.toString());
    event.sender.send("restore-logs", data.toString());
  });
  bat.stderr.setEncoding("utf8");
  bat.stderr.on("data", (data: any) => {
    console.log("error", data.toString());
    event.sender.send("restore-logs", data.toString());
  });

  bat.on("exit", (code: any) => {
    console.log(`Child exited with code ${code}`);
    event.sender.send("restore-logs", `finish-OK`);
    restoreDb(dbOptions,event);
  });
  bat.on("error", (code: any) => {
    console.log(`error ${code}`);
    event.sender.send("restore-logs", `error ${code}`);
  });


};


const restoreFinishActions = (event: IpcMainEvent) => {
  //probar con el nistallIcon pero no es la solucion final
  //  const icon = 'app://./favicon.ico';
  //console.log(icon);
  getBrowserWindow(event)?.setProgressBar(-1);
  new Notification({
    title: "Completado",
    body: "El backup se restauró correctamente"
    //icon:icon
  }).show();
};

const getBrowserWindow = (event: IpcMainEvent): BrowserWindow | null => {
  return BrowserWindow.fromWebContents(event.sender);
};

export {restoreDb, restoreFinishActions, createDb};
