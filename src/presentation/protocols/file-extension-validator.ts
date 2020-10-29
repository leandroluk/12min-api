export interface IFileExtensionValidator {
  isFileExtension(filePath: any): Promise<boolean>
}
