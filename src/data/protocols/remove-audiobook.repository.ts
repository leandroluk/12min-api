export interface IRemoveAudiobookRepository {
  removeAudiobook(audiobookId: string): Promise<boolean>
}
