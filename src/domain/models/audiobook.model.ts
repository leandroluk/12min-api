export enum AudiobookStatus {
  PENDING = 'pending',
  CONVERTING = 'converting',
  READY = 'ready'
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

export interface IAudiobookWithLastStatusModel extends IAudiobookModel {
  status: AudiobookStatus
}
