const spawn = require('child_process').spawn;

const restoreDb = (dbOptions) => {

    const {dbName, host, password, port, user, backupPath} = dbOptions;

    const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
    const params = `--host localhost --port 5433 --username postgres --role postgres --dbname siresTest --verbose D:\\siresTest.backup`;

    const bat = spawn(pgRestoreBinary, params.toString().split(" "), {env: {...process.env, PGPASSWORD: 'roly'}});

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
    bat.on('error', (code) => {
        console.log(`error ${code}`);
    });
};

restoreDb({});
