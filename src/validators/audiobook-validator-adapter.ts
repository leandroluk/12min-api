import fs from 'fs'
import path from 'path'
import { IAudiobookValidator } from '../presentation/protocols/audiobook-validator'

export class AudiobookValidatorAdapter implements IAudiobookValidator {
  async isAudiobook(filepath: string): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        const availableExt = ['.mp3', '.wav', '.m3u8']
        const fileExt = path.extname(filepath).toLowerCase()

        if (!availableExt.includes(fileExt)) {
          return resolve(false)
        }

        fs.access(filepath, (err: Error) => resolve(!err))
      } catch (error) {
        resolve(false)
      }
    })
  }
}
