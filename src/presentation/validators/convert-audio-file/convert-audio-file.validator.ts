import { IConvertAudioFileModel } from '../../../domain/use-cases/convert-audio-file'
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

  async validateConvertAudioFile(convertAudioFile: IConvertAudioFileModel): Promise<any> {
    const errors: any = {}

    if (await this.nullValidator.isNull(convertAudioFile.mimeType)) {
      errors.mimeType = new MissingParamError('mimeType')
    } else {
      if (typeof convertAudioFile.mimeType !== 'string') {
        errors.mimeType = new InvalidParamError('mimeType', 'must be a string')
      }
    }

    if (await this.nullValidator.isNull(convertAudioFile.originalFile)) {
      errors.originalFile = new MissingParamError('originalFile')
    } else {
      if (!await this.fileExtensionValidator.isFileExtension(convertAudioFile.originalFile)) {
        errors.originalFile = new InvalidParamError('originalFile', 'must be a MP3 or WAV file')
      }
    }

    if (await this.nullValidator.isNull(convertAudioFile.path)) {
      errors.path = new MissingParamError('path')
    } else {
      if (!await this.fileExistsValidator.fileExists(convertAudioFile.path)) {
        errors.path = new InvalidParamError('path', 'file no exists')
      }
    }

    return errors
  }
}
