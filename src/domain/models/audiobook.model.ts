export enum AudiobookStatus {
  PENDING = 'pending'
}

export interface IAudiobookModel {
  id: string
  status: AudiobookStatus
  createdAt: Date
  updatedAt?: Date
  title: string
  description: string
  filePath?: string
  tags: string[]
}
