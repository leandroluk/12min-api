import { IAddAudiobookRepository } from '../../../../../data/protocols/add-audiobook.repository'
import { IAudiobookModel } from '../../../../../domain/models/audiobook.model'
import { IAddAudiobookModel } from '../../../../../domain/use-cases/add-audiobook'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'


export class MongoAddAudiobookRepository implements IAddAudiobookRepository {
  async addAudiobook(audiobookData: IAddAudiobookModel): Promise<IAudiobookModel> {
    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    const data = {
      ...audiobookData,
      tags: audiobookData.tags.map(tag => tag.toLocaleLowerCase().trim()),
      createdAt: new Date()
    }
    const result = await audiobookCollection.insertOne(data)
    return MongoHelper.map<IAudiobookModel>(result.ops[0])
  }
}
