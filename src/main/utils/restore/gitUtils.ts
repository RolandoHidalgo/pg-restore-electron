import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { exec, spawn } from 'node:child_process'
import { post_recive } from './constants'
import IpcMainEvent = Electron.IpcMainEvent

const homeDir = os.homedir()

const restoreDir = path.join(homeDir, 'pgRestore')
const gitDir = path.join(homeDir, 'pgRestore', 'repo')
const bareGitDir = path.join(homeDir, 'pgRestore', 'repo.git')
const backUpDir = path.join(homeDir, 'pgRestore', 'backups')

const initReposAndFolders = async () => {
  for (const dir of [restoreDir, bareGitDir, gitDir, backUpDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
      if (dir === bareGitDir) {
        await initBareRepo()
      } else if (dir === backUpDir) {
        await initLocalRepo()
      }
    }
  }
}

const initBareRepo = async (): Promise<void> => {
  await runCommand(bareGitDir, 'git', 'init --bare')
  const hooksDirPath = path.join(bareGitDir, 'hooks')
  if (!fs.existsSync(hooksDirPath)) {
    fs.mkdirSync(hooksDirPath)
  }

  fs.writeFileSync(path.join(bareGitDir, 'hooks', 'post-receive'), post_recive)
}

const performGitFlow = async (cwd: string): Promise<void> => {
  await gitAdd(cwd)
  await gitCommit(cwd, 'commit')
  await gitPull(cwd)
  await gitPush(cwd)
}

const runCommand = async (cwd: string, exe: string, params: string): Promise<void> => {
  return new Promise((resolve, reject) => {

    const paramsSplitted = params.toString().split(' ')
    const bat = spawn(exe, paramsSplitted, { cwd })
    bat.stdout.setEncoding('utf8')
    bat.stdout.on('data', (data: any) => {

    })
    bat.stderr.setEncoding('utf8')
    bat.stderr.on('data', (data: any) => {

    })

    bat.on('exit', (code: any) => {

      resolve()
    })
    bat.on('error', (code: any) => {

      reject(code)
    })
  })
}

const execCommand = async (cwd: string, exe: string, params: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`${exe} ${params}`, { cwd }, (error, stdout, stderr) => {
      if (error) {

        reject(`Error al ejecutar el comando: ${error.message}`)
        return
      }
      if (stderr) {
        reject(`Salida de error: ${stderr}`)
        return
      }
      resolve(stdout)
    })
  })
}
const ensureSafeRepo = async (repoPath: string): Promise<void> => {
  const normalizedRepoPath = path.normalize(repoPath)
  try {
    const resultado = await execCommand(
      repoPath,
      'git',
      ` config --global --get-all safe.directory`
    )

    const repo = resultado
      .split('\n')
      .filter((e) => e !== '')
      .map((e) => path.normalize(e))
      .findIndex((e) => e === normalizedRepoPath)
    //no encontro el repo del pgrestore es porque no se ha hecho antes.
    if (repo === -1) {
      console.info('no estab el repo lo voy a agregar')
      await runCommand(repoPath, 'git', `config --global --add safe.directory ${normalizedRepoPath}`)
    }
  } catch (err) {
    //no tiene nada
    console.info('estaba vacio la llave de safe.directory agregar el repo')
    await runCommand(repoPath, 'git', `config --global --add safe.directory ${normalizedRepoPath}`)
  }
}
const initLocalRepo = async (): Promise<void> => {
  await runCommand(backUpDir, 'git', 'init')
  await runCommand(backUpDir, 'git', `remote add origin file://${bareGitDir}`)
}

const gitAdd = async (cwd: string): Promise<void> => {
  await runCommand(cwd, 'git', 'add .')
}

const gitCommit = async (cwd: string, message: string): Promise<void> => {
  await runCommand(cwd, 'git', `commit -m "${message}"`)
}

const gitPull = async (cwd: string): Promise<void> => {
  await runCommand(cwd, 'git', `pull --allow-unrelated-histories`)
}

const gitPush = async (cwd: string): Promise<void> => {
  await runCommand(cwd, 'git', `push -u origin master`)
}
const postBackupHook = async (): Promise<void> => {
  await performGitFlow(backUpDir)
}

const sincronizarUsb = async (usbPath: string, event: IpcMainEvent) => {
  event.sender.send('sync-logs', {
    code: 1,
    info: 'Preparando los archivos locales.'
  })
  await performGitFlowLocal()
  event.sender.send('sync-logs', {
    code: 2,
    info: 'Actualizando en el dispositivo.'
  })
  await checkAndPrepareUsb(usbPath)
  event.sender.send('sync-logs', {
    code: 3,
    info: 'Actualizando los archivos locales con los datos del dispositivo.'
  })
  await performGitFlowLocal()
  event.sender.send('sync-logs', {
    code: 4,
    info: 'Archivos sincronizados correctamente.'
  })
}

const performGitFlowUsb = async (usbPath: string): Promise<void> => {
  const usbBackupsRepoPath = path.join(usbPath, 'pgRestore', 'backups')
  await performGitFlow(usbBackupsRepoPath)
}
const performGitFlowLocal = async (): Promise<void> => {
  await performGitFlow(backUpDir)
}

const checkAndPrepareUsb = async (usbPath: string): Promise<void> => {
  const usbBackupPath = path.join(usbPath, 'pgRestore')
  if (!fs.existsSync(usbBackupPath)) {
    fs.mkdirSync(usbBackupPath)
  }
  const usbBackupsRepoPath = path.join(usbBackupPath, 'backups')
  if (!fs.existsSync(usbBackupsRepoPath)) {
    //fs.mkdirSync(usbBackupsRepoPath);
    await runCommand(usbBackupPath, 'git', `clone file://${bareGitDir} backups`)
  } else {
    await ensureSafeRepo(usbBackupsRepoPath)
    await runCommand(usbBackupsRepoPath, 'git', `remote set-url origin file://${bareGitDir}`)
    await performGitFlowUsb(usbPath)
  }
}

export { initReposAndFolders, postBackupHook, sincronizarUsb,execCommand }
