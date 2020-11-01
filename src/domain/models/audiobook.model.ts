export enum AudiobookStatus {
  PENDING = 'pending'
}

export interface IAudiobookModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  title: string
  description: string
  filePath?: string
  tags: string[]
}

export interface IAddAudiobookWithLastStatusModel extends IAudiobookModel {
  status: AudiobookStatus
}
