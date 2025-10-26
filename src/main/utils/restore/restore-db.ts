import IpcMainEvent = Electron.IpcMainEvent
import { BrowserWindow, Notification } from 'electron'

import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { DataSource, getDatasource, getDatasources } from './dataSourceUtils'
import { exec, spawn } from 'node:child_process'
import { postBackupHook } from './gitUtils'
import { Client } from 'ssh2'
import SftpClient from 'ssh2-sftp-client'

let commands = {
  restore: 'pg_restore.exe',
  dump: 'pg_dump.exe',
  create: 'createdb.exe',
  psql: 'psql.exe'
}
switch (process.platform) {
  // case "darwin":
  //   return "mac";
  case 'win32':
    break
  default:
    commands = {
      restore: 'pg_restore',
      dump: 'pg_dump',
      create: 'createdb',
      psql: 'psql'
    }
}

export type DbOptions = {
  dbName: string
  port: string
  host: string
  backupPath?: string
  user: string
  password: string
  binary: string
  backUpName?: string
  dsName?: string
  schema?: string
  targetCloneDbName?: string
  isCloning?: boolean
}

export type CreateDebOptions = {
  name: string
  encoding: string
  template: string
  collate: string
  ctype: string
  tablespace: string
}

const restoreDbBase = (dbOptions: DbOptions, event: IpcMainEvent) => {
  const ds: DataSource = getDatasource(dbOptions.dsName!)
  if (!ds.isSSH) {
    restoreDb(dbOptions, event)
  } else {
    restoreDbSSH(dbOptions, ds, event)
  }
}

const uploadBackupSSH = async (
  dbOptions: DbOptions,
  ds: DataSource,
  event: IpcMainEvent
): Promise<string> => {
  console.log(dbOptions, 'sd')
  const localBackupPath = dbOptions.backupPath!
  const remoteBackupPath = `/tmp/${path.basename(localBackupPath)}`
  console.log(remoteBackupPath, 'sd')
  const sshConfig = {
    host: ds.sshHost,
    port: ds.sshPort,
    username: ds.sshUsername,
    password: ds.sshPassword // o usa privateKey si prefieres clave
  }

  const sftp = new SftpClient()
  const totalSize = fs.statSync(localBackupPath).size
  let uploaded = 0

  await sftp.connect(sshConfig)

  const readStream = fs.createReadStream(localBackupPath)
  const writeStream = await sftp.createWriteStream(remoteBackupPath)

  readStream.on('data', (chunk) => {
    uploaded += chunk.length
    const percent = ((uploaded / totalSize) * 100).toFixed(2)
    event.sender.send('restore-logs', `Subiendo Backup al server: ${percent}%`)
    process.stdout.write(`\r📤 Subiendo: ${percent}%`)
    //mandar a la consola aki
  })

  return new Promise((resolve, reject) => {
    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', async () => {
      console.log('\n✅ Subida completada')
      await sftp.end()
      resolve(remoteBackupPath)
    })
    readStream.pipe(writeStream)
  })
}

const downloadBackupSSH = async (
  remoteBackupPath: string,
  dbOptions: DbOptions,
  ds: DataSource,
  event: IpcMainEvent
): Promise<string> => {
  console.log(dbOptions, 'sd')

  const backUpDir = path.join(os.homedir(), 'pgRestore', 'backups')
  if (!fs.existsSync(backUpDir)) {
    fs.mkdirSync(backUpDir)
  }

  const localBackupPath = path.join(backUpDir, `${path.basename(remoteBackupPath)}`)
  //const remoteBackupPath = `/tmp/${path.basename(localBackupPath)}`
  console.log(remoteBackupPath, 'sd')
  const sshConfig = {
    host: ds.sshHost,
    port: ds.sshPort,
    username: ds.sshUsername,
    password: ds.sshPassword // o usa privateKey si prefieres clave
  }

  const sftp = new SftpClient()
  await sftp.connect(sshConfig)
  const fileInfo = await sftp.stat(remoteBackupPath)
  const totalSize = fileInfo.size
  let downloaded = 0

  const readStream = await sftp.createReadStream(remoteBackupPath)
  const writeStream = fs.createWriteStream(localBackupPath)

  readStream.on('data', (chunk) => {
    downloaded += chunk.length
    const percent = ((downloaded / totalSize) * 100).toFixed(2)
    event.sender.send('restore-logs', `Descargando Backup desde el server: ${percent}%`)
    process.stdout.write(`\r📤 Bajando: ${percent}%`)
    //mandar a la consola aki
  })

  return new Promise((resolve, reject) => {
    let finished = false
    readStream.on('error', (err) => {
      if (finished) {
        console.warn('⚠️ Error ignorado después de finish:', err.message)
        return
      }
      console.error(err, 'readStreams')
      reject(err)
    })
    writeStream.on('error', (err) => {
      console.error(err, 'writeStream')
      reject(err)
    })
    // writeStream.on('close', async () => {
    //   console.log('\n✅ Descarga completada')
    //   await sftp.end()
    //   resolve(localBackupPath)
    // })
    // readStream.on('end', async () => {
    //   console.log('\n✅ Descarga completada');
    //   await sftp.end();
    //   resolve(localBackupPath)
    // });

    readStream.pipe(writeStream)

    writeStream.on('finish', async () => {
      console.log('✅ Archivo escrito completamente')
      finished = true
      await sftp.end()

      resolve(localBackupPath)
    })
  })
}

const cleanTempFilesSSH = async (
  backupPath: string,
  ds: DataSource,
  event: IpcMainEvent
): Promise<void> => {
  const remoteBackupPath = `/tmp/${path.basename(backupPath)}`
  console.log(remoteBackupPath, 'sd')
  const sshConfig = {
    host: ds.sshHost,
    port: ds.sshPort,
    username: ds.sshUsername,
    password: ds.sshPassword // o usa privateKey si prefieres clave
  }

  const sftp = new SftpClient()

  await sftp.connect(sshConfig)
  event.sender.send('restore-logs', `Limpiando archivos temporales.`)
  await sftp.delete(remoteBackupPath)
  await sftp.end()
}

const restoreDbSSH = async (dbOptions: DbOptions, ds: DataSource, event: IpcMainEvent) => {
  try {
    const remoteBackupPath = dbOptions.isCloning
      ? `/tmp/${path.basename(dbOptions.backupPath!)}`
      : await uploadBackupSSH(dbOptions, ds, event)
    console.log('Subida completada ', remoteBackupPath)
    try {
      await new Promise<void>((resolve, reject) => {
        const { host, password, port, username } = ds
        const sshConfig = {
          host: ds.sshHost,
          port: ds.sshPort,
          username: ds.sshUsername,
          password: ds.sshPassword // o usa privateKey si prefieres clave
        }

        const conn = new Client()
        conn.on('ready', () => {
          console.log('🛠️ Ejecutando restore db...')
          const params = `--host ${host} --port ${port} --username ${username} --role postgres --dbname ${dbOptions.dbName} --verbose`

          const cmd = `PGPASSWORD=${password} pg_restore ${params} ${remoteBackupPath}`
          //const cmd = `PGPASSWORD=${password} createdb ${params}`
          //const cmd = `pg_restore -U ${dbUser} -d ${dbName} ${remoteBackupPath}`;
          const env = { PGPASSWORD: password }

          conn.exec(cmd, { env }, (err, stream) => {
            if (err) {
              //error de otro tipo
              console.log(`error `)
              event.sender.send('restore-logs', `error ${err}`)
              return reject(err)
            }

            stream
              .on('close', (code) => {
                console.log(`\n📦 restore finalizada con código ${code}`)
                conn.end()

                resolve()
                //llamar al restoreDbSSH
                //restoreDb(dbOptions, event)
              })
              .on('data', (data) => {
                event.sender.send('restore-logs', data.toString())
                //process.stdout.write('🟢 ' + data.toString())
              })
              .stderr.on('data', (data) => {
                //error ejecutando el cmd
                process.stderr.write('🔴 ' + data.toString())
                event.sender.send('restore-logs', data.toString())
              })
          })
        })

        conn.on('error', (e) => {
          event.sender.send('restore-logs', `error conectando por ssh. ${e}`)
          reject(e)
        })
        conn.connect(sshConfig)
      })
      if (!dbOptions.isCloning) {
        await cleanTempFilesSSH(dbOptions.backupPath!, ds, event)
        event.sender.send('restore-logs', `finish-OK`)
      }
    } catch (e) {
      event.sender.send('restore-logs', `error no se pudo completar la tarea ${e}`)
      await cleanTempFilesSSH(dbOptions.backupPath!, ds, event)
    }
  } catch (err) {
    event.sender.send('restore-logs', `error ${err}`)
  }
}

const restoreDb = (dbOptions: DbOptions, event: IpcMainEvent) => {
  const { dbName, host, password, port, user, backupPath, binary } = dbOptions

  //const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
  const params = `--host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName} --verbose`

  const paramsSplitted = params.toString().split(' ')
  paramsSplitted.push(path.normalize(backupPath))

  const exe = path.join(binary, commands.restore)
  const bat = spawn(exe, paramsSplitted, { env: { ...process.env, PGPASSWORD: password } })
  getBrowserWindow(event)?.setProgressBar(2)
  bat.stdout.setEncoding('utf8')
  bat.stdout.on('data', (data: any) => {
    event.sender.send('restore-logs', data.toString())
  })
  bat.stderr.setEncoding('utf8')
  bat.stderr.on('data', (data: any) => {
    event.sender.send('restore-logs', data.toString())
  })

  bat.on('exit', (code: any) => {
    event.sender.send('restore-logs', `finish-restore-ok`)
  })
  bat.on('error', (code: any) => {
    event.sender.send('restore-logs', `error ${code}`)
  })
}

function getFormattedDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}_${month}_${day}_${hours}${minutes}`
}

function listDatabases(
  user: string,
  password: string,
  host: string,
  port: number,
  binary: string
): Promise<string[]> {
  // Replace 'your_username' and 'your_password' with your credentials

  return new Promise((resolve, reject) => {
    const command = `"${binary}\\${commands.psql}" -U ${user} --host ${host} --port ${port} -c "\\l"`

    // Execute the psql command
    exec(command, { env: { PGPASSWORD: password } }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        reject(error.message)
        return
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`)
        reject(stderr)
        return
      }

      // Process and print the output

      const lines = stdout
        .split('\n')
        .filter((line) => line.includes('|'))
        .map((line) => line.split('|')[0].trim())
        .filter((line) => line !== '' && line !== 'template0' && line !== 'template1')
        .splice(1)
      resolve(lines)

      console.log(lines)
    })
  })
}

function listDatabasesSSH(ds: DataSource): Promise<string[]> {
  const sshConfig = {
    host: ds.sshHost,
    port: ds.sshPort,
    username: ds.sshUsername,
    password: ds.sshPassword // o usa privateKey si prefieres clave
  }

  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      console.log('🛠️ Ejecutando listar...')
      const cmd = `PGPASSWORD=${ds.password} psql -U ${ds.username} --host ${ds.host} --port ${ds.port} -c "\\l"`
      //const cmd = `pg_restore -U ${dbUser} -d ${dbName} ${remoteBackupPath}`;
      const env = { PGPASSWORD: ds.password }
      let out = ''
      conn.exec(cmd, { env }, (err, stream) => {
        if (err) return reject(err)

        stream
          .on('close', (code) => {
            console.log(`\n📦 lista finalizada con código ${code}`)
            conn.end()
            const lines = out
              .split('\n')
              .filter((line) => line.includes('|'))
              .map((line) => line.split('|')[0].trim())
              .filter((line) => line !== '' && line !== 'template0' && line !== 'template1')
              .splice(1)

            resolve(lines)
          })
          .on('data', (data) => {
            out += data.toString()

            //process.stdout.write('🟢 ' + data.toString())
          })
          .stderr.on('data', (data) => {
            process.stderr.write('🔴 ' + data.toString())
          })
      })
    })

    conn.on('error', (e) => {
      reject(e)
    })
    conn.connect(sshConfig)
    //resolve([])
  })
}

const obtenerEsquemas = (ds: DataSource, dbName: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const { port, password, binary, host, username } = ds

    exec(
      `"${binary}\\${commands.psql}" -U ${username} --host ${host} -d ${dbName} --port ${port} -c "\\dn"`,
      { env: { PGPASSWORD: password } },
      (error, stdout, stderr) => {
        if (error) {
          return reject(`Error ejecutando el comando: ${error.message}`)
        }
        if (stderr) {
          return reject(`Error en la salida estándar: ${stderr}`)
        }

        // Procesar la salida para extraer los nombres de los esquemas
        const esquemas = stdout
          .split('\n') // Dividir la salida por líneas
          .slice(3, -3) // Ignorar encabezado y pie de página (ajusta según sea necesario)
          .map((line) => line.split('|')[0].trim()) // Extraer y limpiar nombres

        resolve(esquemas)
      }
    )
  })
}
const obtenerEsquemasSSH = (ds: DataSource, dbName: string): Promise<string[]> => {
  const sshConfig = {
    host: ds.sshHost,
    port: ds.sshPort,
    username: ds.sshUsername,
    password: ds.sshPassword // o usa privateKey si prefieres clave
  }
  console.log('sshConfig', sshConfig)
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      console.log('🛠️ Ejecutando listar schemas...')
      const cmd = `PGPASSWORD=${ds.password} psql -U ${ds.username} --host ${ds.host} -d ${dbName} --port ${ds.port} -c "\\dn"`
      //const cmd2 = `"${binary}\\${commands.psql}" -U ${username} --host ${host} -d ${dbName} --port ${port} -c "\\dn"`;
      const env = { PGPASSWORD: ds.password }
      let out = ''
      conn.exec(cmd, { env }, (err, stream) => {
        if (err) return reject(err)

        stream
          .on('close', (code) => {
            console.log(`\n📦 lista schema finalizada con código ${code}`)
            conn.end()
            // Procesar la salida para extraer los nombres de los esquemas
            const esquemas = out
              .split('\n') // Dividir la salida por líneas
              .slice(3, -3) // Ignorar encabezado y pie de página (ajusta según sea necesario)
              .map((line) => line.split('|')[0].trim()) // Extraer y limpiar nombres

            resolve(esquemas)
          })
          .on('data', (data) => {
            out += data.toString()

            //process.stdout.write('🟢 ' + data.toString())
          })
          .stderr.on('data', (data) => {
            process.stderr.write('🔴 ' + data.toString())
          })
      })
    })

    conn.on('error', (e) => {
      reject(e)
    })
    conn.connect(sshConfig)
  })
}

const getDatabaseByDatasource = async (dataSourceName: string): Promise<string[]> => {
  const ds: DataSource = getDatasource(dataSourceName)
  return !ds.isSSH
    ? listDatabases(ds.username, ds.password, ds.host, ds.port, ds.binary)
    : listDatabasesSSH(ds)
}
const getDatabaseSchamasByDatasourceAndDbName = async (
  dsName: string,
  dbName: string
): Promise<string[]> => {
  const ds: DataSource = getDatasource(dsName)
  return !ds.isSSH ? obtenerEsquemas(ds, dbName) : obtenerEsquemasSSH(ds, dbName)
}

const backupDbBase = async (dbOptions: DbOptions, event: IpcMainEvent): Promise<string> => {
  const ds: DataSource = getDatasource(dbOptions.dsName!)
  if (!ds.isSSH) {
    await backupDb(dbOptions, event)
  } else {
    await backupDbSSH(dbOptions, ds, event)
  }
}

const backupDbSSH = async (
  dbOptions: DbOptions,
  ds: DataSource,
  event: IpcMainEvent
): Promise<string> => {
  //backupSSH
  //clean
  //send finish-Ok

  const backUpPath = getBackupDirForSSH(dbOptions)

  try {
    await new Promise<void>((resolve, reject) => {
      const { host, password, port, username } = ds
      const sshConfig = {
        host: ds.sshHost,
        port: ds.sshPort,
        username: ds.sshUsername,
        password: ds.sshPassword // o usa privateKey si prefieres clave
      }

      const conn = new Client()
      conn.on('ready', () => {
        console.log('🛠️ Ejecutando dump db...')
        const { dbName, schema } = dbOptions
        const schammaParams = schema && schema != '' ? ` --schema "${schema}"` : ''

        //const params = `-F c --host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName}`;

        const params = `--file ${backUpPath} --host ${host} --port ${port} --username ${username} --format=c --verbose${schammaParams} ${dbName}`

        const cmd = `PGPASSWORD=${password} pg_dump ${params}`

        const env = { PGPASSWORD: password }

        conn.exec(cmd, { env }, (err, stream) => {
          if (err) {
            //error de otro tipo
            console.log(`error `)
            event.sender.send('restore-logs', `error ${err}`)
            return reject(err)
          }

          stream
            .on('close', (code) => {
              console.log(`\n📦 dump finalizada con código ${code}`)
              conn.end()

              resolve()
              //llamar al restoreDbSSH
              //restoreDb(dbOptions, event)
            })
            .on('data', (data) => {
              event.sender.send('restore-logs', data.toString())
              //process.stdout.write('🟢 ' + data.toString())
            })
            .stderr.on('data', (data) => {
              //error ejecutando el cmd
              process.stderr.write('🔴 ' + data.toString())
              event.sender.send('restore-logs', data.toString())
            })
        })
      })

      conn.on('error', (e) => {
        event.sender.send('restore-logs', `error conectando por ssh. ${e}`)
        reject(e)
      })
      conn.connect(sshConfig)
    })
    if (!dbOptions.isCloning) {
      try {
        await downloadBackupSSH(backUpPath, dbOptions, ds, event)
        console.log('Descarga completada paso download')
        await cleanTempFilesSSH(backUpPath, ds, event)
        event.sender.send('restore-logs', `finish-OK`)
      } catch (err) {
        console.error(err, 'sera aki')
        event.sender.send('restore-logs', `error ${err}`)
      }
    }
  } catch (e) {
    event.sender.send('restore-logs', `error no se pudo completar la tarea ${e}`)
    await cleanTempFilesSSH(dbOptions.backupPath!, ds, event)
  }
  return backUpPath
}

const getBackupDirForSSH = (dbOptions: DbOptions) => {
  const { dbName, schema } = dbOptions
  const schemmaName = schema && schema != '' ? `_${schema}` : ''
  const backupFullName = `${dbName}${schemmaName}_${getFormattedDateTime()}.backup`
  // const backupPath = path.join('/tmp/', backupFullName)
  return `/tmp/${backupFullName}`
}

const backupDb = (dbOptions: DbOptions, event: IpcMainEvent): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { dbName, host, password, port, user, binary, schema } = dbOptions

    const backUpDir = path.join(os.homedir(), 'pgRestore', 'backups')
    if (!fs.existsSync(backUpDir)) {
      fs.mkdirSync(backUpDir)
    }

    const schemmaName = schema && schema != '' ? `_${schema}` : ''
    const schammaParams = schema && schema != '' ? ` --schema "${schema}"` : ''
    const backupFullName = `${dbName}${schemmaName}_${getFormattedDateTime()}.backup`
    const backupPath = path.join(backUpDir, backupFullName)

    //const params = `-F c --host ${host} --port ${port} --username ${user} --role postgres --dbname ${dbName}`;
    let params = `--file ${path.normalize(backupPath)} --host ${host} --port ${port} --username ${user} --format=c --verbose${schammaParams} ${dbName}`

    const paramsSplitted = params.toString().split(' ')
    //paramsSplitted.push(path.normalize(backupPath));

    const exe = path.join(binary, commands.dump)

    const bat = spawn(exe, paramsSplitted, { env: { ...process.env, PGPASSWORD: password } })
    getBrowserWindow(event)?.setProgressBar(2)
    bat.stdout.setEncoding('utf8')
    bat.stdout.on('data', (data: any) => {
      console.log('data', data.toString())
      event.sender.send('restore-logs', data.toString())
    })
    bat.stderr.setEncoding('utf8')
    bat.stderr.on('data', (data: any) => {
      console.log('error', data.toString())
      event.sender.send('restore-logs', data.toString())
    })

    bat.on('exit', (code: any) => {
      console.log(`Child exited with code ${code}`)
      event.sender.send('restore-logs', `finish-OK`)
      postBackupHook()
      resolve(backupPath)
    })
    bat.on('error', (code: any) => {
      console.log(`error ${code}`)
      event.sender.send('restore-logs', `error ${code}`)
    })
  })
}

const createDbBase = (
  dbOptions: DbOptions,
  createDbOptions: CreateDebOptions,
  event: IpcMainEvent
) => {
  const ds: DataSource = getDatasource(dbOptions.dsName!)
  if (!ds.isSSH) {
    createDb(dbOptions, createDbOptions, event)
  } else {
    createDbSSH(dbOptions, ds, createDbOptions, event)
  }
}

const createDbSSH = async (
  dbOptions: DbOptions,
  ds: DataSource,
  createDbOptions: CreateDebOptions,
  event: IpcMainEvent
) => {
  try {
    await new Promise<void>((resolve, reject) => {
      const { host, password, port, username } = ds
      const sshConfig = {
        host: ds.sshHost,
        port: ds.sshPort,
        username: ds.sshUsername,
        password: ds.sshPassword // o usa privateKey si prefieres clave
      }

      const conn = new Client()
      conn.on('ready', () => {
        console.log('🛠️ Ejecutando crear db...')
        let params = `--host ${host} --port ${port} --username ${username}`

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

        params += ` ${dbOptions.dbName}`
        const cmd = `PGPASSWORD=${password} createdb ${params}`
        //const cmd = `pg_restore -U ${dbUser} -d ${dbName} ${remoteBackupPath}`;
        const env = { PGPASSWORD: password }

        conn.exec(cmd, { env }, (err, stream) => {
          if (err) {
            //error de otro tipo
            console.log(`error `)
            event.sender.send('restore-logs', `error ${err}`)
            return reject(err)
          }

          stream
            .on('close', (code) => {
              console.log(`\n📦 crear finalizada con código ${code}`)
              conn.end()

              event.sender.send('restore-logs', `finish-OK`)
              //llamar al restoreDbSSH
              resolve()
            })
            .on('data', (data) => {
              event.sender.send('restore-logs', data.toString())
              //process.stdout.write('🟢 ' + data.toString())
            })
            .stderr.on('data', (data) => {
              //error ejecutando el cmd
              process.stderr.write('🔴 ' + data.toString())
              event.sender.send('restore-logs', data.toString())
              reject(data.toString())
            })
        })
      })

      conn.on('error', (e) => {
        event.sender.send('restore-logs', `error conectando por ssh. ${e}`)
        reject(`error conectando por ssh. ${e}`)
      })
      conn.connect(sshConfig)
    })
    await restoreDbSSH(dbOptions, ds, event)
  } catch (e) {
    event.sender.send('restore-logs', `error conectando por ssh. ${e}`)
    throw e
  }
}
const createDb = (dbOptions: DbOptions, createDbOptions: CreateDebOptions, event: IpcMainEvent) => {
  const { dbName, host, password, port, user, binary } = dbOptions

  //const pgRestoreBinary = `C:\\Program Files (x86)\\PostgreSQL\\10\\bin\\pg_restore.exe`;
  let params = `--host ${host} --port ${port} --username ${user}`

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

  const paramsSplitted = params.toString().split(' ')

  const exe = path.join(binary, commands.create)

  const bat = spawn(exe, paramsSplitted, { env: { ...process.env, PGPASSWORD: password } })
  getBrowserWindow(event)?.setProgressBar(2)

  bat.stdout.setEncoding('utf8')

  bat.stdout.on('data', (data: any) => {
    console.log('data', data.toString())
    event.sender.send('restore-logs', data.toString())
  })
  bat.stderr.setEncoding('utf8')
  bat.stderr.on('data', (data: any) => {
    console.log('error', data.toString())
    event.sender.send('restore-logs', data.toString())
  })

  bat.on('exit', (code: any) => {
    console.log(`Child exited with code ${code}`)
    event.sender.send('restore-logs', `finish-OK`)
    restoreDb(dbOptions, event)
  })
  bat.on('error', (code: any) => {
    console.log(`error ${code}`)
    event.sender.send('restore-logs', `error ${code}`)
  })
}

const cloneDbBase = async (
  dbOptions: DbOptions,
  createDbOptions: CreateDebOptions,
  event: IpcMainEvent
) => {
  const ds: DataSource = getDatasource(dbOptions.dsName!)
  if (!ds.isSSH) {
    await cloneDb(dbOptions, createDbOptions, event)
  } else {
    await cloneDbSSH(dbOptions, ds, createDbOptions, event)
  }
}

const cloneDbSSH = async (
  dbOptions: DbOptions,
  ds: DataSource,
  createDbOptions: CreateDebOptions,
  event: IpcMainEvent
) => {
  dbOptions.isCloning = true
  dbOptions.backupPath = await backupDbSSH(dbOptions, ds, event)
  console.log('backup db ssh clonando ', dbOptions.backupPath)
  dbOptions.dbName = dbOptions.targetCloneDbName

  await createDbSSH(dbOptions, ds, createDbOptions, event)
  console.log('terminado todo vamos a descargar y limpiar')
  try {
    await downloadBackupSSH(dbOptions.backupPath!, dbOptions, ds, event)
    console.log('Descarga completada paso download')
    await cleanTempFilesSSH(dbOptions.backupPath!, ds, event)
    event.sender.send('restore-logs', `finish-OK`)
  } catch (err) {
    console.error(err, 'sera aki')
    event.sender.send('restore-logs', `error ${err}`)
  }
}

const cloneDb = async (
  dbOptions: DbOptions,
  createDbOptions: CreateDebOptions,
  event: IpcMainEvent
) => {
  dbOptions.backupPath = await backupDb(dbOptions, event)

  dbOptions.dbName = dbOptions.targetCloneDbName

  createDb(dbOptions, createDbOptions, event)
}

const restoreFinishActions = (event: IpcMainEvent) => {
  //probar con el nistallIcon pero no es la solucion final
  //  const icon = 'app://./favicon.ico';
  //console.log(icon);
  getBrowserWindow(event)?.setProgressBar(-1)
  new Notification({
    title: 'Completado',
    body: 'El backup se restauró correctamente'
    //icon:icon
  }).show()
}

const getBrowserWindow = (event: IpcMainEvent): BrowserWindow | null => {
  return BrowserWindow.fromWebContents(event.sender)
}

export {
  restoreDb,
  restoreFinishActions,
  createDb,
  backupDb,
  getDatabaseByDatasource,
  getDatabaseSchamasByDatasourceAndDbName,
  cloneDb,
  createDbBase,
  backupDbBase,
  cloneDbBase
}
