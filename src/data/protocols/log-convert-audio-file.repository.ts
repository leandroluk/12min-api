import { ILogConvertAudioFileModel } from '../../domain/models/log-convert-audio-file.model'
import { ILogConvertAudioFileInput } from '../../domain/use-cases/log-convert-audio-file'

export interface ILogConvertAudioFileRepository {
  logConvertAudioFile(logConvertAudioFile: ILogConvertAudioFileInput): Promise<ILogConvertAudioFileModel>
}
