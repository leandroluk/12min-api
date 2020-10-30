import { ILogConvertAudioFileModel } from '../models/log-convert-audio-file.model'

export interface IGetAudiobookStatus {
  getAudiobookStatus(audiobookId: string): Promise<ILogConvertAudioFileModel>
}
