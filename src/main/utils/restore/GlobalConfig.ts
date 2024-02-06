type Config = {
    fileArgv: string;
}

class GlobalConfig {
    private static globalConfig: GlobalConfig;
    private config: Config;


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {

        this.config = {
            fileArgv: ''
        }
    }

    static getInstance() {
        if (!GlobalConfig.globalConfig) {
            this.globalConfig = new GlobalConfig();
        }

        return this.globalConfig;

    }

    public setConfig(argv: string) {
        this.config.fileArgv = argv;
    }


    getConfiguration(): Config {
        return this.config;
    }
}

export {GlobalConfig}