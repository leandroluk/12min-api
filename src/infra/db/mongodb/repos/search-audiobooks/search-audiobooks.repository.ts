import { ISearchAudiobooksRepository } from '../../../../../data/protocols/search-audiobooks.repository'
import { IAudiobookWithLastStatusModel } from '../../../../../domain/models/audiobook.model'
import { IResultQuery } from '../../../../../domain/models/result-query.model'
import { ISearchAudiobooksParsedQuery } from '../../../../../domain/use-cases/search-audiobooks'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'

export class MongoSearchAudiobooksRepository implements ISearchAudiobooksRepository {
  async searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>> {
    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)

    const match = {
      title: new RegExp(query.title, 'i'),
      description: new RegExp(query.description, 'i')
    } as any

    const tags = query.tags.map(tag => tag.toLocaleLowerCase().trim())

    if (tags.length > 0) {
      match.tags = { $in: query.tags }
    }

    const agg = [
      // find matchers passed on query
      {
        $match: match
      },
      // join audiobookStatus collection
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
      },
      // build result query using offset and limit
      {
        $facet: {
          info: [
            { $group: { _id: null, total: { $sum: 1 } } }
          ],
          items: [
            { $skip: query.offset },
            { $limit: query.limit }
          ]
        }
      },
      // detatch virtual info of result query
      {
        $unwind: {
          path: '$info',
          preserveNullAndEmptyArrays: true
        }
      },
      // project extracting
      {
        $project: {
          total: '$info.total',
          items: 1
        }
      }
    ]

    const [resultQuery]: Array<IResultQuery<IAudiobookWithLastStatusModel>> = await audiobookCollection.aggregate(agg).toArray()

    resultQuery.offset = query.offset
    resultQuery.limit = query.limit

    if (resultQuery.items.length) {
      resultQuery.items = resultQuery.items.map(item => MongoHelper.map<IAudiobookWithLastStatusModel>(item))
    }

    if (!resultQuery.total) {
      resultQuery.total = 0
    }

    return resultQuery
  }
}
