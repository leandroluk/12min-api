export interface IRemoveAudiobook {
  removeAudiobook(
    audiobookId: string
  ): Promise<boolean>
}
