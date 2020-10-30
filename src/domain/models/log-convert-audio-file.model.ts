import { AudiobookStatus } from './audiobook.model'

export interface ILogConvertAudioFileModel {
  id: string
  createdAt: Date
  status: AudiobookStatus
  audiobookId: string
  convertAudioFile?: string
  message?: string
}
