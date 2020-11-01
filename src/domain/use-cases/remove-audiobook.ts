export interface IRemoveAudiobookParams {
  audiobookId: string
}

export interface IRemoveAudiobook {
  removeAudiobook(audiobookId: string): Promise<boolean>
}
