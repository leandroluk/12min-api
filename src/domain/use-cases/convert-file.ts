export interface IConvertFile {
  convertFile(file: string): Promise<string>
}
