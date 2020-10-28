import { IAudiobookModel } from '../models/audiobook.model'

export interface IConvertAudiobookToM3u8 {
  convertAudiobook(audiobook: IAudiobookModel): Promise<void>
}
