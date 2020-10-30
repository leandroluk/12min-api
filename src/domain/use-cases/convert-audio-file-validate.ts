export interface IConvertAudioFileValidate {
  validateConvertAudioFile(convertAudioFile: string): Promise<Error>
}
