import IpcMainEvent = Electron.IpcMainEvent;
import {BrowserWindow, Notification} from "electron";

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import {DataSource, getDatasource, getDatasources} from "./dataSourceUtils";
import {exec, spawn} from "node:child_process";
import {postBackupHook} from './gitUtils'


export type DbOptions = {
  dbName: string;
  port: string;
  host: string;
  backupPath?: string;
  user: string;
  password: string;
  binary: string;
  backUpName?: string;
  dsName?: string;
  schema?: string;
  targetCloneDbName?: string;
}

export type CreateDebOptions = {
  name: string
  encoding: string
  template: string
  collate: string
  ctype: string
  tablespace: string
}
const restoreDb = (dbOptions: DbOptions, event: IpcMainEvent) => {
  const {dbName, host, password, port, user, backupPath, binary} = dbOptions;

  //const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
  const params = `--host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName} --verbose`;


  const paramsSplitted = params.toString().split(" ");
  paramsSplitted.push(path.normalize(backupPath));



  const exe = path.join(binary, 'pg_restore.exe');
  const bat = spawn(exe, paramsSplitted, {env: {...process.env, PGPASSWORD: password}});
  getBrowserWindow(event)?.setProgressBar(2);
  bat.stdout.setEncoding("utf8");
  bat.stdout.on("data", (data: any) => {

    event.sender.send("restore-logs", data.toString());
  });
  bat.stderr.setEncoding("utf8");
  bat.stderr.on("data", (data: any) => {

    event.sender.send("restore-logs", data.toString());
  });

  bat.on("exit", (code: any) => {

    event.sender.send("restore-logs", `finish-OK`);
  });
  bat.on("error", (code: any) => {

    event.sender.send("restore-logs", `error ${code}`);
  });
};


function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}_${month}_${day}_${hours}${minutes}`;
}

function listDatabases(user: string, password: string, host: string, port: number, binary: string): Promise<string[]> {
  // Replace 'your_username' and 'your_password' with your credentials


  return new Promise((resolve, reject) => {
    const command = `"${binary}\\psql.exe" -U ${user} --host ${host} --port ${port} -c "\\l"`;

    // Execute the psql command
    exec(command, {env: {PGPASSWORD: password}}, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
        return;
      }

      // Process and print the output

      const lines = stdout.split('\n')
        .filter(line => line.includes('|'))
        .map(line => line.split('|')[0].trim())
        .filter(line => line !== '' && line !== 'template0' && line !== 'template1')
        .splice(1);
      resolve(lines);

      console.log(lines);

    });
  })

}

const obtenerEsquemas = (ds: DataSource, dbName: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {

    const {port, password, binary, host, username} = ds;

    exec(`"${binary}\\psql.exe" -U ${username} --host ${host} -d ${dbName} --port ${port} -c "\\dn"`, {env: {PGPASSWORD: password}}, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error ejecutando el comando: ${error.message}`);
      }
      if (stderr) {
        return reject(`Error en la salida estándar: ${stderr}`);
      }

      // Procesar la salida para extraer los nombres de los esquemas
      const esquemas = stdout
        .split('\n') // Dividir la salida por líneas
        .slice(3, -3) // Ignorar encabezado y pie de página (ajusta según sea necesario)
        .map((line) => line.split('|')[0].trim()); // Extraer y limpiar nombres

      resolve(esquemas);
    });
  });
};
const getDatabaseByDatasource = async (dataSourceName: string): Promise<string[]> => {

  const ds: DataSource = getDatasource(dataSourceName);
  return listDatabases(ds.username, ds.password, ds.host, ds.port, ds.binary);
}
const getDatabaseSchamasByDatasourceAndDbName = async (dsName: string, dbName: string): Promise<string[]> => {

  const ds: DataSource = getDatasource(dsName);
  return obtenerEsquemas(ds, dbName);
}
const backupDb = (dbOptions: DbOptions, event: IpcMainEvent):Promise<string> => {
  return new Promise((resolve, reject) => {
    const {dbName, host, password, port, user, binary, schema} = dbOptions;


    const backUpDir = path.join(os.homedir(), "pgRestore", "backups");
    if (!fs.existsSync(backUpDir)) {
      fs.mkdirSync(backUpDir);
    }

    const schemmaName = (schema && schema != '') ? `_${schema}` : '';
    const schammaParams = (schema && schema != '') ? ` --schema "${schema}"` : '';
    const backupFullName = `${dbName}${schemmaName}_${getFormattedDateTime()}.backup`;
    const backupPath = path.join(backUpDir, backupFullName)

    //const params = `-F c --host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName}`;
    let params = `--file ${path.normalize(backupPath)} --host ${host} --port ${port} --username ${user} --format=c --verbose${schammaParams} ${dbName}`;


    const paramsSplitted = params.toString().split(" ");
    //paramsSplitted.push(path.normalize(backupPath));


    const exe = path.join(binary, 'pg_dump.exe');

    const bat = spawn(exe, paramsSplitted, {env: {...process.env, PGPASSWORD: password}});
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
      postBackupHook()
      resolve(backupPath)
    });
    bat.on("error", (code: any) => {
      console.log(`error ${code}`);
      event.sender.send("restore-logs", `error ${code}`);
    });
  })
};


const createDb = (dbOptions: DbOptions, createDbOptions: CreateDebOptions, event: IpcMainEvent) => {

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

  params += ` ${dbName}`

  const paramsSplitted = params.toString().split(" ");

  const exe = path.join(binary, 'createdb.exe');


  const bat = spawn(exe, paramsSplitted, {env: {...process.env, PGPASSWORD: password}});
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
    restoreDb(dbOptions, event);
  });
  bat.on("error", (code: any) => {
    console.log(`error ${code}`);
    event.sender.send("restore-logs", `error ${code}`);
  });


};

const cloneDb = async (dbOptions: DbOptions, createDbOptions: CreateDebOptions, event: IpcMainEvent)=>{
  dbOptions.backupPath =  await backupDb(dbOptions,event)

  dbOptions.dbName = dbOptions.targetCloneDbName

  createDb(dbOptions,createDbOptions,event);
}


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

export {
  restoreDb,
  restoreFinishActions,
  createDb,
  backupDb,
  getDatabaseByDatasource,
  getDatabaseSchamasByDatasourceAndDbName,
  cloneDb
};
