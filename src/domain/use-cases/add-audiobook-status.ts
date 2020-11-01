import { IAudiobookStatusModel } from '../models/audiobook-status.model'
import { AudiobookStatus } from '../models/audiobook.model'

export interface IAddAudiobookStatusModel {
  audiobookId: string
  status: AudiobookStatus
  convertAudioFile?: string
  message?: string
}

export interface IAddAudiobookStatus {
  addAudiobookStatus(addAudiobookStatus: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel>
}
