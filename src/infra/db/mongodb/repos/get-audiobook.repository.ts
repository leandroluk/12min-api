import { ObjectID } from 'mongodb'
import { IGetAudiobookRepository } from '../../../../data/protocols/get-audiobook.repository'
import { IAudiobookWithLastStatusModel } from '../../../../domain/models/audiobook.model'
import { InvalidParamError } from '../../../../errors/invalid-param/invalid-param.error'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'

export class MongoGetAudiobookRepository implements IGetAudiobookRepository {
  async getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel> {
    let _id: ObjectID

    try {
      _id = MongoHelper.objectId(audiobookId)
    } catch (error) {
      throw new InvalidParamError('audiobookId', 'must be a valid object id')
    }

    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)

    const agg = [
      // find specific audiobookId
      {
        $match: { _id }
      },
      // join in audiobookStatuses collection
      {
        $lookup: {
          from: env.mongo.collections.audiobookStatuses,
          localField: '_id',
          foreignField: 'audiobookId',
          as: 'status'
        }
      },
      // detach virtual audibook's with one audiobookStatus
      {
        $unwind: { path: '$status', preserveNullAndEmptyArrays: true }
      },
      // reorder by audiobookStatus as DESC
      {
        $sort: { 'status.createdAt': -1 }
      },
      // group with only first data of each audiobook
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          title: { $first: '$title' },
          description: { $first: '$description' },
          filePath: { $first: '$filePath' },
          tags: { $first: '$tags' },
          status: { $first: '$status.status' }
        }
      },
      // project each audiobook with your list of fields
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          title: 1,
          description: 1,
          filePath: 1,
          tags: 1,
          status: 1
        }
      }
    ]

    const [audiobook] = await audiobookCollection
      .aggregate(agg)
      .toArray()

    if (audiobook) {
      return MongoHelper.map<IAudiobookWithLastStatusModel>(audiobook)
    }

    return null
  }
}
