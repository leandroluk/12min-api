import { IAudiobookModel } from '../../domain/models/audiobook.model'
import { IAddAudiobookModel } from '../../domain/use-cases/add-audiobook'

export interface IAddAudiobookRepository {
  addAudiobook(audiobook: IAddAudiobookModel, filePath: string): Promise<IAudiobookModel>
}
