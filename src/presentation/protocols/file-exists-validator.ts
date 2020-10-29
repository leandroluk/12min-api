export interface IFileExistsValidator {
  fileExists(path: any): Promise<boolean>
}
