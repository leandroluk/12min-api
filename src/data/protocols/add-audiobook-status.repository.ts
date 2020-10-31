import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'
import { IAddAudiobookStatusModel } from '../../domain/use-cases/add-audiobook-status'

export interface IAddAudiobookStatusRepository {
  addAudiobookStatus(addAudiobookStatus: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel>
}
