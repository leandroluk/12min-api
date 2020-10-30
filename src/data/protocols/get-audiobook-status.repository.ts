import { ILogConvertAudioFileModel } from '../../domain/models/log-convert-audio-file.model'

export interface IGetAudiobookStatusRepository {
  getAudiobookStatus(audiobookId: string): Promise<ILogConvertAudioFileModel>
}
