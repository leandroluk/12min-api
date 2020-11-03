import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'

export interface IFindAudiobookToConvertRepository {
  findAudiobookToConvert(): Promise<IAudiobookStatusModel>
}
