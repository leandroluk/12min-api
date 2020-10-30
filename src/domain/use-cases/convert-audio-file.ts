export interface IConvertAudioFile {
  convertAudioFile(audioFile: string): Promise<string>
}
