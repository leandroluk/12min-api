import { IFileExistsValidator } from '../../protocols/file-exists-validator'
import { IFileExtensionValidator } from '../../protocols/file-extension-validator'
import { INullValidator } from '../../protocols/null-validator'
import { ConvertFileValidator } from './convert-file.validator'

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
  sut: ConvertFileValidator
} => {
  const convertAudioFile = '/path/to/uploaded/file.mp3'
  const nullValidator = makeNullValidator()
  const fileExtensionValidator = makeFileExtensionValidator()
  const fileExistsValidator = makeFileExistsValidator()
  const sut = new ConvertFileValidator(nullValidator, fileExtensionValidator, fileExistsValidator)

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
      await sut.validateConvertFile(audioFile)
      expect(isNullSpy).toHaveBeenCalled()
    })

    test('should IFileExtensionValidator to be called', async () => {
      const { sut, fileExtensionValidator, convertAudioFile } = makeSut()
      const isFileExtensionSpy = jest.spyOn(fileExtensionValidator, 'isFileExtension')
      await sut.validateConvertFile(convertAudioFile)
      expect(isFileExtensionSpy).toHaveBeenCalledWith(convertAudioFile)
    })

    test('should IFileExistsValidator to be called', async () => {
      const { sut, fileExistsValidator, convertAudioFile } = makeSut()
      const fileExistsSpy = jest.spyOn(fileExistsValidator, 'fileExists')
      await sut.validateConvertFile(convertAudioFile)
      expect(fileExistsSpy).toHaveBeenCalledWith(convertAudioFile)
    })

    test('should return missing param error if audioFile is no provided', async () => {
      const { sut, nullValidator, convertAudioFile } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateConvertFile(convertAudioFile)
      expect(result.message).toMatch(/Missing param.*convertAudioFile.*?/)
    })

    test('should return invalid param error if audioFile is invalid', async () => {
      const { sut, fileExtensionValidator, fileExistsValidator, convertAudioFile } = makeSut()
      const regexInvalid = /Invalid param.*convertAudioFile.*?/
      let result: Error

      result = await sut.validateConvertFile(1 as any)
      expect(result.message).toMatch(regexInvalid)

      jest.spyOn(fileExtensionValidator, 'isFileExtension').mockResolvedValueOnce(false)
      result = await sut.validateConvertFile(convertAudioFile)
      expect(result.message).toMatch(regexInvalid)

      jest.spyOn(fileExistsValidator, 'fileExists').mockResolvedValueOnce(false)
      result = await sut.validateConvertFile(convertAudioFile)
      expect(result.message).toMatch(regexInvalid)
    })

    test('should return null if audioFile is valid', async () => {
      const { sut, convertAudioFile } = makeSut()
      const result = await sut.validateConvertFile(convertAudioFile)
      expect(result).toBeNull()
    })
  })
})
