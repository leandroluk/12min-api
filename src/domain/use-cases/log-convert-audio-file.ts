import { AudiobookStatus } from '../models/audiobook.model'
import { ILogConvertAudioFileModel } from '../models/log-convert-audio-file.model'

export interface ILogConvertAudioFileInput {
  audiobookId: string
  status: AudiobookStatus
  convertAudioFile?: string
  message?: string
}

export interface ILogConvertAudioFile {
  logConvertAudioFile(logConvertAudioFile: ILogConvertAudioFileInput): Promise<ILogConvertAudioFileModel>
}
