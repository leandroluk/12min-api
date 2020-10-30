import { IAudiobookModel } from '../models/audiobook.model'
import { ILogConvertAudioFileModel } from '../models/log-convert-audio-file.model'

export interface ILogConvertAudioFile {
  logConvertAudioFile(audiobook: IAudiobookModel, convertAudioFile: string): Promise<ILogConvertAudioFileModel>
}
