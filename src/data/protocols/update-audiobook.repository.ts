import { IAudiobookWithLastStatusModel } from '../../domain/models/audiobook.model'
import { IUpdateAudiobookModel } from '../../domain/use-cases/update-audiobook'

export interface IUpdateAudiobookRepository {
  updateAudiobook(audiobookId: string, audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel>
}
