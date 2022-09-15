const {Regedit, ProgId, ShellOption} = require('electron-regedit');

//... instantiate your ProgIds
new ProgId({
    description: 'My Application File pepe',
    friendlyAppName: true,
    extensions: ['backup'],
    shell: [
        new ShellOption({verb: ShellOption.OPEN}),
        new ShellOption({verb: ShellOption.EDIT, args: ['--edit']}),
        new ShellOption({verb: 'customaction', args: ['--custom'], action: 'Awesome Action'})
    ]
});
new ProgId({
    description: 'My Application File pepe',
    friendlyAppName: true,
    extensions: ['pepe']
});


const squirrelStartupEvent = (app) => {
    if (process.platform !== 'win32') {
        return false;
    }
    const squirellPos = process.argv.indexOf('--squirrel-install');
    let squirrelCommand = process.argv[squirellPos];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
            console.log('instalando el puto squirell');
            console.log(Regedit.progIds, 'los idssss');
            Regedit.installAll();
            return true;
        case '--squirrel-uninstall':

            Regedit.uninstallAll();
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
};

module.exports = {
    handleSquirell: (app) => {
        const handle = squirrelStartupEvent();
        console.log(handle, "handleee###############");
        if (handle) {
            //app.quit();
        }

    }
};
