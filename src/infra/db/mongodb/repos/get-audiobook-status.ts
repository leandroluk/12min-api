import { IGetAudiobookStatusRepository } from '../../../../data/protocols/get-audiobook-status.repository'
import { ILogConvertAudioFileModel } from '../../../../domain/models/log-convert-audio-file.model'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'


export class MongoGetAudiobookStatusRepository implements IGetAudiobookStatusRepository {
  async getAudiobookStatus(audiobookId: string): Promise<ILogConvertAudioFileModel> {
    const logConvertAudioFileCollection = MongoHelper.getCollection(env.mongo.collections.logConvertAudioFiles)
    const logConvertAudioFile = await logConvertAudioFileCollection.findOne({ audiobookId })

    if (logConvertAudioFile) {
      return MongoHelper.map<ILogConvertAudioFileModel>(logConvertAudioFile)
    }

    return null
  }
}
