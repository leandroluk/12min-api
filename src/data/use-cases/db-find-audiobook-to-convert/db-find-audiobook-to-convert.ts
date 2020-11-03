import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { IFindAudiobookToConvert } from '../../../domain/use-cases/find-audiobook-to-convert'
import { IFindAudiobookToConvertRepository } from '../../protocols/find-audiobook-to-convert.repository'

export class DbFindAudiobookToConvert implements IFindAudiobookToConvert {
  constructor(
    readonly findAudiobookToConvertRepository: IFindAudiobookToConvertRepository
  ) { }

  async findAudiobookToConvert(): Promise<IAudiobookStatusModel> {
    return await this.findAudiobookToConvertRepository.findAudiobookToConvert()
  }
}
