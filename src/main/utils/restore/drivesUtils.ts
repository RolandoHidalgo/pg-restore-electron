import { exec } from 'node:child_process';
import {resolve} from 'node:path'
import fs from 'node:fs'


const getUSBDrives = async ():Promise<{name:string,mount:string}> => {
// Ejecutar el comando WMIC para obtener información de las unidades

  return new Promise((res, reject) => {
    exec('wmic logicaldisk  where "DriveType=2" get DeviceID,VolumeName,DriveType', (error, stdout, stderr) => {
      if (error) {
        console.error('Error ejecutando el comando:', error);
        reject(error);
        return;
      }

      // Mostrar los puntos de montaje de las unidades extraíbles
      console.log('Puntos de montaje de unidades USB:');
      const lines = stdout.trim().split('\n').slice(1); // Ignorar la cabecera
      res(lines.map((line) => {
        const [mount,name] = line.trim().split('2').map(usb=>usb.trim())
        console.log(name,mount,fs.existsSync(resolve(mount)));
        return {name,mount:resolve(mount)}
      }))
    });
  })
}

export { getUSBDrives }
