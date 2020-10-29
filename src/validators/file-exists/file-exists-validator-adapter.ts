import fs from 'fs'
import { IFileExistsValidator } from '../../presentation/protocols/file-exists-validator'

export class FileExistsValidatorAdapter implements IFileExistsValidator {
  async fileExists(path: any): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        if (typeof path !== 'string') {
          return resolve(false)
        }
        fs.accessSync(path, fs.constants.R_OK)
        resolve(true)
      } catch (error) {
        resolve(false)
      }
    })
  }
}
