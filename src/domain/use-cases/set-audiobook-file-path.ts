import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'

export interface ISetAudiobookFilePath {
  setAudiobookFilePath(audiobookId: string, filePath: string): Promise<IAudiobookWithLastStatusModel>
}
