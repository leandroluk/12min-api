import { ILogConvertAudioFileModel } from '../../domain/models/log-convert-audio-file.model'
import { ILogConvertAudioFile, ILogConvertAudioFileInput } from '../../domain/use-cases/log-convert-audio-file'
import { ILogConvertAudioFileRepository } from '../protocols/log-convert-audio-file.repository'

export class DbLogConvertAudioFile implements ILogConvertAudioFile {
  constructor(
    readonly logConvertAudioFileRepository: ILogConvertAudioFileRepository
  ) { }

  async logConvertAudioFile(logConvertAudioFile: ILogConvertAudioFileInput): Promise<ILogConvertAudioFileModel> {
    return await this.logConvertAudioFileRepository.logConvertAudioFile(logConvertAudioFile)
  }
}
