export interface IConvertAudioFileModel {
  mimeType: string
  originalFile: string
  path: string
}

export interface IConvertAudioFile {
  convertAudioFile(audioFile: IConvertAudioFileModel): Promise<string>
}
