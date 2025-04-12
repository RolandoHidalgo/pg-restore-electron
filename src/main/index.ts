import {app, shell, BrowserWindow, ipcMain} from 'electron'
import {join} from 'node:path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import {GlobalConfig} from './utils/restore/GlobalConfig'


import {
  restoreDb,
  restoreFinishActions,
  createDb,
  backupDb,
  getDatabaseByDatasource,
  getDatabaseSchamasByDatasourceAndDbName
} from './utils/restore/restore-db'
import {findBinarys} from './utils/restore/binariesUtils'
import { initReposAndFolders, sincronizarUsb } from './utils/restore/gitUtils'
// @ts-ignore
import {handleSquirell} from './utils/restore/regeditUtils'

import log from 'electron-log'
import {autoUpdater} from 'electron-updater'
import {addDatasources, DataSource, getDatasources} from "./utils/restore/dataSourceUtils";
import { getUSBDrives } from './utils/restore/drivesUtils'

try{
  initReposAndFolders();
}catch (e){
  console.error(e)
}
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
    width: 342,
    height: 626,
    show: false,
    //resizable:false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {icon} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  function sendStatusToWindow(updateEvent, text,bps=null,total=null,percent=null,transferred=null) {
    log.info(text)
    mainWindow.webContents.send('update-logs', {updateEvent, text,bps,percent,total,transferred})
  }

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking', 'Checking')
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update_available.', 'Update_available.')
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update_not_available', 'Update_not_available')
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error', 'Error')
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    //sendStatusToWindow('progress', 'log_message', 102654, (94371840/1024/1024), 10.4543345, )
    sendStatusToWindow('progress', log_message, progressObj.bytesPerSecond, Number(progressObj.total)/1024/1024, Number(progressObj.percent),(parseFloat( String(progressObj.transferred))/1024/1024).toFixed(2))
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update_downloaded', 'Update_downloaded')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {action: 'deny'}
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
  console.log(app.getVersion(),'la versionnnn');
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('restore-db', (event, dbOptions) => {
    restoreDb(dbOptions, event)

  })
  ipcMain.on('sincronizar-usb',async (event, usbDrive:string) => {

    await sincronizarUsb(usbDrive,event)
  })

  ipcMain.on('backup-db', (event, dbOptions) => {
    backupDb(dbOptions, event)

  })

  ipcMain.on('create-db', (event, dbOptions, createDbOptions) => {
    console.log('create-db', dbOptions)
    createDb(dbOptions, createDbOptions, event)

  })

  ipcMain.handle('add-datasource', async (event, ds: DataSource) => {
    await addDatasources(ds)
  })

  ipcMain.handle('obtener-version', async () => {
    return app.getVersion()
  });


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
  ipcMain.handle('get-dbs', async (event,name:string) => {
    console.log('main con name',name)
    return getDatabaseByDatasource(name)


  })
  ipcMain.handle('get-schemmas', async (event,dsName:string,dbName:string) => {

    return getDatabaseSchamasByDatasourceAndDbName(dsName,dbName)


  })
  ipcMain.handle('get-drives', async (event) => {

    return getUSBDrives()


  })

  ipcMain.handle('get-datasource', (): DataSource[] => {

    return getDatasources();


  })
  createWindow()
  // addDatasources({
  //   host:'localhost',
  //   port:5433,
  //   username:'postgres',
  //   password:'postgres',
  //   binary:'C:\\Program Files\\PostgreSQL\\13\\bin',
  //   name:'local'
  // })
  // console.log('asdasdldldldldle3333',getDatasources())
  app.on('activate', function () {
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
