import { IAddAudiobookStatusRepository } from '../../../../data/protocols/add-audiobook-status.repository'
import { IAudiobookStatusModel } from '../../../../domain/models/audiobook-status.model'
import { IAddAudiobookStatusModel } from '../../../../domain/use-cases/add-audiobook-status'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'


export class MongoAddAudiobookStatusRepository implements IAddAudiobookStatusRepository {
  async addAudiobookStatus(addAudiobookStatusModel: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
    const audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    const data = {
      ...addAudiobookStatusModel,
      createdAt: new Date(),
      audiobookId: new MongoHelper.ObjectID(addAudiobookStatusModel.audiobookId)
    }

    const inserted = await audiobookStatusCollection.insertOne(data)

    const { audiobookId, ...rest } = (inserted).ops[0]

    return MongoHelper.map<IAudiobookStatusModel>({
      ...rest,
      audiobookId: audiobookId.toHexString()
    })
  }
}
