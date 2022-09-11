import IpcMainEvent = Electron.IpcMainEvent;

type DbOtions = {
    dbName: string;
    port: string;
    host: string;
    backupPath: string;
    user: string;
    password: string;
    binary: string;

}
const spawn = require('child_process').spawn;

const restoreDb = (dbOptions: DbOtions, event: IpcMainEvent) => {

    const {dbName, host, password, port, user, backupPath, binary} = dbOptions;

    const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
    const params = `--host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName} --verbose ${backupPath}`;

    console.log(binary);
    console.log(pgRestoreBinary);
    console.log(dbOptions);
    const bat = spawn(pgRestoreBinary, params.toString().split(" "), {env: {...process.env, PGPASSWORD: password}});


    bat.stdout.on('data', (data: any) => {
        console.log(data.toString());
        event.sender.send('restore-console',data.toString())
    });

    bat.stderr.on('data', (data: any) => {
        console.error(data.toString());
        event.sender.send('restore-console',data.toString())
    });

    bat.on('exit', (code: any) => {
        console.log(`Child exited with code ${code}`);
        event.sender.send('restore-console',`Child exited with code ${code}`)
    });
    bat.on('error', (code: any) => {
        console.log(`error ${code}`);
        event.sender.send('restore-console',`error ${code}`)
    });
};

export {restoreDb};
