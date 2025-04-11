import { execSync } from "child_process";


const log = (msg) => console.log(`\n${msg}`);

const exit = (msg) => {
  console.error(msg);
  process.exit(1);
};

const run = (cmd, cwd) => {
  execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });
};

const getPlatform = () => {
  switch (process.platform) {
    case "darwin":
      return "mac";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
};

const getEnv = (name) => process.env[name.toUpperCase()] || null;

const setEnv = (name, value) => {
  if (value) {
    process.env[name.toUpperCase()] = value.toString();
  }
};

const getInput = (
  name,
  required
) => {
  const value = getEnv(`INPUT_${name}`);
  if (required && !value) {
    exit(`"${name}" input variable is not defined`);
    return ""
  } else {
    return value
  }
};

(function () {
  const platform = getPlatform();
  const packageRoot =".";
  const buildScriptName = 'build';

  const packageManager = "pnpm"



  log(`Using ${packageManager} `);



  // NOTE: Set code signing certificate and password importing through the config
  if (platform === "mac") {
    setEnv("CSC_LINK", getInput("mac_certs"));
    setEnv("CSC_KEY_PASSWORD", getInput("mac_certs_password"));

    setEnv("APPLE_ID", getInput("apple_id"));
    setEnv("APPLE_ID_PASSWORD", getInput("apple_id_password"));
    setEnv("APPLE_ID_TEAM", getInput("apple_id_team"));
  } else if (platform === "windows") {
    setEnv("CSC_LINK", getInput("windows_certs"));
    setEnv("CSC_KEY_PASSWORD", getInput("windows_certs_password"));
  }

  // NOTE: Disable console ads
  setEnv("ADBLOCK", true);

  log(`Installing dependencies using ${packageManager}…`);
  run(
    "pnpm install",
    packageRoot
  );
  run(`pnpm run ${buildScriptName}`, packageRoot);

  log(`Building  and releasing the Electron application…`);
  run(
    `electron-builder --${platform} --publish always`,
    packageRoot
  );

})();
