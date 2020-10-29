import { IConvertAudioFileModel } from './convert-audio-file'

export interface IConvertAudioFileValidate {
  validateConvertAudioFile(convertAudioFile: IConvertAudioFileModel): Promise<any>
}
