import { IAudiobookStatusModel } from '../models/audiobook-status.model'

export interface IFindAudiobookToConvert {
  findAudiobookToConvert(): Promise<IAudiobookStatusModel>
}
