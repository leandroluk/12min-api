import { IConvertFileValidate } from '../../../domain/use-cases/convert-file-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import env from '../../../main/config/env'
import { IFileExistsValidator } from '../../protocols/file-exists-validator'
import { IFileExtensionValidator } from '../../protocols/file-extension-validator'
import { INullValidator } from '../../protocols/null-validator'

export class ConvertAudioFileValidator implements IConvertFileValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly fileExtensionValidator: IFileExtensionValidator,
    readonly fileExistsValidator: IFileExistsValidator
  ) { }

  async validateConvertFile(convertAudioFile: string): Promise<Error> {
    if (await this.nullValidator.isNull(convertAudioFile)) {
      return new MissingParamError('convertAudioFile')
    }
    if (typeof convertAudioFile !== 'string') {
      return new InvalidParamError('convertAudioFile', 'must be a string')
    }
    if (!await this.fileExtensionValidator.isFileExtension(convertAudioFile)) {
      return new InvalidParamError('convertAudioFile', `must be one of ${env.converters.fileExtensionMatchers.join()} file`)
    }
    if (!await this.fileExistsValidator.fileExists(convertAudioFile)) {
      return new InvalidParamError('convertAudioFile', 'file no exists')
    }
    return null
  }
}
