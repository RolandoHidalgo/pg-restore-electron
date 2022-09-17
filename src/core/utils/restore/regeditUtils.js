const {Regedit, ProgId, ShellOption} = require('electron-regedit');

//... instantiate your ProgIds
new ProgId({
    description: 'Restaurar PostgreSQl .backup files',
    friendlyAppName: true,
    extensions: ['backup'],
    shell: [
        new ShellOption({verb: ShellOption.OPEN, icon: './pg-restore.exe'}),
        new ShellOption({verb: ShellOption.EDIT, args: ['--edit']}),
        new ShellOption({verb: 'customaction', args: ['--custom'], action: 'Awesome Action'})
    ]
});


const writeChekFile = () => {
    const fs = require('fs');


    try {
        fs.writeFileSync(getCheckFilePaht(), 'true');
        // file written successfully
    } catch (err) {
        console.error(err);
    }
};


const isFisrtRun = () => {
    const fs = require('fs');



    try {

        return !fs.existsSync(getCheckFilePaht());
        // file written successfully
    } catch (err) {
        console.error(err);
    }
};

const getCheckFilePaht = () => {
    const path = require('path');
    return path.join(path.dirname(process.argv[0]), 'apprun.info');
};

const squirrelStartupEvent = (app) => {
    if (process.platform !== 'win32' || process.env.WEBPACK_DEV_SERVER_URL) {
        return false;
    }

    if (isFisrtRun()) {
        Regedit.installAll();
        writeChekFile();
    }
};

module.exports = {
    handleSquirell: (app) => {
        const handle = squirrelStartupEvent();
        if (handle) {
            //app.quit();
        }

    }
};
