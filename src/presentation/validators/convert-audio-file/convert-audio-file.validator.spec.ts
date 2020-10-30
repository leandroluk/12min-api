import { IFileExistsValidator } from '../../protocols/file-exists-validator'
import { IFileExtensionValidator } from '../../protocols/file-extension-validator'
import { INullValidator } from '../../protocols/null-validator'
import { ConvertAudioFileValidator } from './convert-audio-file.validator'

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeFileExtensionValidator = (): IFileExtensionValidator => {
  class FileExtensionValidatorStub implements IFileExtensionValidator {
    async isFileExtension(_filePath: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new FileExtensionValidatorStub()
}

const makeFileExistsValidator = (): IFileExistsValidator => {
  class FileExistsValidatorStub implements IFileExistsValidator {
    async fileExists(path: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new FileExistsValidatorStub()
}

const makeSut = (): {
  convertAudioFile: string
  nullValidator: INullValidator
  fileExtensionValidator: IFileExtensionValidator
  fileExistsValidator: IFileExistsValidator
  sut: ConvertAudioFileValidator
} => {
  const convertAudioFile = '/path/to/uploaded/file.mp3'
  const nullValidator = makeNullValidator()
  const fileExtensionValidator = makeFileExtensionValidator()
  const fileExistsValidator = makeFileExistsValidator()
  const sut = new ConvertAudioFileValidator(nullValidator, fileExtensionValidator, fileExistsValidator)

  return {
    convertAudioFile,
    nullValidator,
    fileExtensionValidator,
    fileExistsValidator,
    sut
  }
}

describe('ConvertAudioFileValidator', () => {
  describe('validateConvertAudioFile', () => {
    test('should INullValidator to be called', async () => {
      const { sut, nullValidator, convertAudioFile: audioFile } = makeSut()
      const isNullSpy = jest.spyOn(nullValidator, 'isNull')
      await sut.validateConvertAudioFile(audioFile)
      expect(isNullSpy).toHaveBeenCalled()
    })

    test('should IFileExtensionValidator to be called', async () => {
      const { sut, fileExtensionValidator, convertAudioFile } = makeSut()
      const isFileExtensionSpy = jest.spyOn(fileExtensionValidator, 'isFileExtension')
      await sut.validateConvertAudioFile(convertAudioFile)
      expect(isFileExtensionSpy).toBeCalledWith(convertAudioFile)
    })

    test('should IFileExistsValidator to be called', async () => {
      const { sut, fileExistsValidator, convertAudioFile } = makeSut()
      const fileExistsSpy = jest.spyOn(fileExistsValidator, 'fileExists')
      await sut.validateConvertAudioFile(convertAudioFile)
      expect(fileExistsSpy).toBeCalledWith(convertAudioFile)
    })

    test('should return missing param error if audioFile is no provided', async () => {
      const { sut, nullValidator, convertAudioFile } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateConvertAudioFile(convertAudioFile)
      expect(result.message).toMatch(/Missing param.*convertAudioFile.*?/)
    })

    test('should return invalid param error if audioFile is invalid', async () => {
      const { sut, fileExtensionValidator, fileExistsValidator, convertAudioFile } = makeSut()
      let result

      jest.spyOn(fileExtensionValidator, 'isFileExtension').mockResolvedValueOnce(false)
      result = await sut.validateConvertAudioFile(convertAudioFile)
      expect(result.message).toMatch(/Invalid param.*convertAudioFile.*?/)

      jest.spyOn(fileExistsValidator, 'fileExists').mockResolvedValueOnce(false)
      result = await sut.validateConvertAudioFile(convertAudioFile)
      expect(result.message).toMatch(/Invalid param.*convertAudioFile.*?/)
    })

    test('should return null if audioFile is valid', async () => {
      const { sut, convertAudioFile } = makeSut()
      const result = await sut.validateConvertAudioFile(convertAudioFile)
      expect(result).toBeNull()
    })
  })
})
