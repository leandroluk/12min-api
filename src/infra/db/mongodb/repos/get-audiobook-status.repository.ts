import { IGetAudiobookStatusRepository } from '../../../../data/protocols/get-audiobook-status.repository'
import { IAudiobookStatusModel } from '../../../../domain/models/audiobook-status.model'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'


export class MongoGetAudiobookStatusRepository implements IGetAudiobookStatusRepository {
  async getAudiobookStatus(audiobookId: string): Promise<IAudiobookStatusModel> {
    const audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)
    const audiobookStatus = await audiobookStatusCollection.findOne({ audiobookId })

    if (audiobookStatus) {
      return MongoHelper.map<IAudiobookStatusModel>(audiobookStatus)
    }

    return null
  }
}
