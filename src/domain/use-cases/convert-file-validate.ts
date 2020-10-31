export interface IConvertFileValidate {
  validateConvertFile(convertFile: string): Promise<Error>
}
