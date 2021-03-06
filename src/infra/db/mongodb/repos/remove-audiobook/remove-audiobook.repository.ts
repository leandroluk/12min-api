import { ObjectID } from 'mongodb'
import { IRemoveAudiobookRepository } from '../../../../../data/protocols/remove-audiobook.repository'
import { InvalidParamError } from '../../../../../errors/invalid-param/invalid-param.error'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'

export class MongoRemoveAudiobookRepository implements IRemoveAudiobookRepository {
  async removeAudiobook(audiobookId: string): Promise<boolean> {
    let _id: ObjectID

    try {
      _id = MongoHelper.objectId(audiobookId)
    } catch (error) {
      throw new InvalidParamError('audiobookId')
    }

    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    const audiobookStatusesCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    const [{ deletedCount }] = await Promise.all([
      audiobookCollection.deleteOne({ _id }),
      audiobookStatusesCollection.deleteMany({ audiobookId: _id })
    ])

    return !!deletedCount
  }
}
