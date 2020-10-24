export interface IUpdateAudiobookProcessStatus {
  updateAudiobookProcessStatus(
    audiobookId: string,
    processStatus: string
  ): Promise<boolean>
}
