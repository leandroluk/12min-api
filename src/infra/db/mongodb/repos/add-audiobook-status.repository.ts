import { IAddAudiobookStatusRepository } from '../../../../data/protocols/add-audiobook-status.repository'
import { IAudiobookStatusModel } from '../../../../domain/models/audiobook-status.model'
import { IAddAudiobookStatusModel } from '../../../../domain/use-cases/add-audiobook-status'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'


export class MongoAddAudiobookStatusRepository implements IAddAudiobookStatusRepository {
  async addAudiobookStatus(addAudiobookStatusModel: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
    const audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)
    const data = {
      createdAt: new Date(),
      ...addAudiobookStatusModel
    }
    const result = await audiobookStatusCollection.insertOne(data)
    return MongoHelper.map<IAudiobookStatusModel>(result.ops[0])
  }
}
