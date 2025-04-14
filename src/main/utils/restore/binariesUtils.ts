import path from 'path'
import fs from 'fs'
import { exec } from 'node:child_process'
import { execCommand } from './gitUtils'
import { getDatasource } from './dataSourceUtils'

const basePath64 = path.join('C:', 'Program Files', 'PostgreSQL')
const basePath86 = path.join('C:', 'Program Files (x86)', 'PostgreSQL')
const basePathsArch = [basePath64, basePath86]

const getVersions = (basePath) => {
  const arq = basePath.toString().includes('(x86)') ? 'x86' : '64'

  const dirs = fs.readdirSync(basePath)

  return dirs
    .map((e) => {
      const pathToRestore = path.join(basePath, e, 'bin', 'pg_restore.exe')
      const exist = fs.existsSync(pathToRestore)
      return exist ? { arq, version: e, binary: path.dirname(pathToRestore) } : null
    })
    .filter((o) => o !== null)
}

const findBinarys = () => {
  console.log('el process desde el binary', process.argv)
  return basePathsArch.map((e) => (fs.existsSync(e) ? getVersions(e) : [])).flat()
}
export type BackupInfo = {
  fecha: string
  entries: number
  dbVersion: string
  pgDumpVersion: string
  dbName: string
}
const parseBackup = async (dsName: string, backupPath: string): Promise<BackupInfo> => {
  const output = await pgRestore_l(getDatasource(dsName).binary, backupPath)
  const infoLines = output.split('\n').filter((line) => line.trim().startsWith(';'))
  const info = {
    fecha: '',
    entries: 0,
    dbVersion: '',
    pgDumpVersion: '',
    dbName: ''
  }
  infoLines.forEach((line) => {
    if (line.includes('pg_dump')) {
      info.pgDumpVersion = getValueAfterDoublePoints(line)
    } else if (line.includes('database')) {
      info.dbVersion = getValueAfterDoublePoints(line)
    } else if (line.includes('Entries') && info.entries === 0) {
      info.entries = Number(getValueAfterDoublePoints(line))
    } else if (line.includes('created at')) {
      info.fecha = line.split('created at')[1].split('\r')[0].substring(1)
    } else if (line.includes('dbname')) {
      info.dbName = getValueAfterDoublePoints(line)
    }
  })
  console.log('infoLines', info)
  return info
}
const getValueAfterDoublePoints = (line: string, splitPattern = ':') => {
  return line.split(splitPattern)[1].trim().split('\r')[0]
}
const pgRestore_l = async (binPath: string, backupPath: string) => {
  return execCommand(binPath, 'pg_restore.exe', ` -l ${backupPath}`)
}

export { findBinarys, parseBackup }
