import { IAddAudiobookRepository } from '../../../../data/protocols/add-audiobook.repository'
import { IAudiobookModel } from '../../../../domain/models/audiobook.model'
import { IAddAudiobookModel } from '../../../../domain/use-cases/add-audiobook'
import { MongoHelper } from '../helpers/mongo.helper'


export class MongoAddAudiobookRepository implements IAddAudiobookRepository {
  async addAudiobook(audiobookData: IAddAudiobookModel): Promise<IAudiobookModel> {
    const audiobookCollection = MongoHelper.getCollection('audiobooks')
    const data = {
      ...audiobookData,
      createdAt: new Date()
    }
    const result = await audiobookCollection.insertOne(data)
    return MongoHelper.map<IAudiobookModel>(result.ops[0])
  }
}
