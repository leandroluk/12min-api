import { AudiobookStatus } from './audiobook.model'

export interface IAudiobookStatusModel {
  id: string
  createdAt: Date
  status: AudiobookStatus
  audiobookId: string
  convertAudioFile?: string
  message?: string
}
