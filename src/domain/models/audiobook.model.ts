export enum AudiobookStatus {
  START = 'start',
  CONVERTING = 'converting',
  INVALID_FILE_FORMAT = 'invalid file format',
  READY = 'ready',
}

export interface IAudiobookModel {
  id: string
  status: AudiobookStatus
  title: string
  description: string
  filePath: string
  tags: string[]
}
