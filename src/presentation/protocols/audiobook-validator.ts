export interface IAudiobookValidator {
  isAudiobook(filepath: string): Promise<boolean>
}
