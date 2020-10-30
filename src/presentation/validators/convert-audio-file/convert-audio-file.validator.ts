import { IConvertAudioFileValidate } from '../../../domain/use-cases/convert-audio-file-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { IFileExistsValidator } from '../../protocols/file-exists-validator'
import { IFileExtensionValidator } from '../../protocols/file-extension-validator'
import { INullValidator } from '../../protocols/null-validator'

export class ConvertAudioFileValidator implements IConvertAudioFileValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly fileExtensionValidator: IFileExtensionValidator,
    readonly fileExistsValidator: IFileExistsValidator
  ) { }

  async validateConvertAudioFile(convertAudioFile: string): Promise<Error> {
    if (await this.nullValidator.isNull(convertAudioFile)) {
      return new MissingParamError('convertAudioFile')
    }
    if (typeof convertAudioFile !== 'string') {
      return new InvalidParamError('convertAudioFile', 'must be a string')
    }
    if (!await this.fileExtensionValidator.isFileExtension(convertAudioFile)) {
      return new InvalidParamError('convertAudioFile', 'must be a MP3 or WAV file')
    }
    if (!await this.fileExistsValidator.fileExists(convertAudioFile)) {
      return new InvalidParamError('convertAudioFile', 'file no exists')
    }
    return null
  }
}
