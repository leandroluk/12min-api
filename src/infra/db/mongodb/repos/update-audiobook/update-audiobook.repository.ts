import { IUpdateAudiobookRepository } from '../../../../../data/protocols/update-audiobook.repository'
import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../../../domain/models/audiobook.model'
import { IUpdateAudiobookModel } from '../../../../../domain/use-cases/update-audiobook'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'

export class MongoUpdateAudiobookRepository implements IUpdateAudiobookRepository {
  async updateAudiobook(audiobookId: string, audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
    if (!Object.keys(audiobookData).length) {
      return undefined
    }

    const _id = MongoHelper.objectId(audiobookId)
    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    const audiobookStatusesCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    const [
      { ok, value: newAudiobook },
      lastAudiobookStatus
    ] = await Promise.all([
      audiobookCollection.findOneAndUpdate(
        { _id },
        { $set: { ...audiobookData, updatedAt: new Date() } },
        { upsert: false, returnOriginal: false }
      ),
      await audiobookStatusesCollection.findOne(
        { audiobookId: _id },
        { sort: { createdAt: -1 } }
      )
    ])

    if (!ok || !newAudiobook) {
      return undefined
    }

    newAudiobook.status = lastAudiobookStatus.status || AudiobookStatus.PENDING

    return MongoHelper.map<IAudiobookWithLastStatusModel>(newAudiobook)
  }
}
