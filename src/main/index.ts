import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import { GlobalConfig } from './utils/restore/GlobalConfig'


import { restoreDb, restoreFinishActions, createDb } from './utils/restore/restore-db'
import { findBinarys } from './utils/restore/binariesUtils'

// @ts-ignore
import { handleSquirell } from './utils/restore/regeditUtils'

import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

const postgresBinaries = findBinarys()
GlobalConfig.getInstance().setConfig('pepe')


handleSquirell()

//autoUpdater.forceDevUpdateConfig = true

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'pgRestore',
    width: 590,
    height: 550,
    show: false,
    //resizable:false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  function sendStatusToWindow(updateEvent, text ) {
    log.info(text)
    mainWindow.webContents.send('update-logs', { updateEvent, text })
  }

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking','Checking')
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update_available.','Update_available.')
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update_not_available','Update_not_available')
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error','Error')
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow('progress',log_message)
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update_downloaded','Update_downloaded')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch('lang', 'es')
app.whenReady().then(() => {
  app.commandLine.appendSwitch('lang', 'es')
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron.pgUI-restore')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('restore-db', (event, dbOptions) => {
    restoreDb(dbOptions, event)

  })

  ipcMain.on('create-db', (event, dbOptions, createDbOptions) => {
    createDb(dbOptions, createDbOptions, event)

  })

  ipcMain.on('check-update', (event) => {
    autoUpdater.checkForUpdatesAndNotify()

  })

  ipcMain.on('restore-finish', (event) => {
    restoreFinishActions(event)

  })


  ipcMain.handle('file-args', () => {

    const backupFile = process.argv.filter(e => {
      return e.toString().includes('.backup')
    })
    console.log(backupFile[0], 'file')
    return backupFile.length > 0 ? backupFile[0] : null


  })

  ipcMain.handle('get-binaries', () => {

    return postgresBinaries


  })
  createWindow()

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
