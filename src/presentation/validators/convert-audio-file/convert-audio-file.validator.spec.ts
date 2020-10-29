import { IConvertAudioFileModel } from '../../../domain/use-cases/convert-audio-file'
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
  convertAudioFileModel: IConvertAudioFileModel
  nullValidator: INullValidator
  fileExtensionValidator: IFileExtensionValidator
  fileExistsValidator: IFileExistsValidator
  sut: ConvertAudioFileValidator
} => {
  const convertAudioFileModel = {
    originalFile: 'originalFile.ext',
    mimeType: 'mime/type',
    path: '/path/to/uploaded/file'
  }
  const nullValidator = makeNullValidator()
  const fileExtensionValidator = makeFileExtensionValidator()
  const fileExistsValidator = makeFileExistsValidator()
  const sut = new ConvertAudioFileValidator(nullValidator, fileExtensionValidator, fileExistsValidator)

  return {
    convertAudioFileModel,
    nullValidator,
    fileExtensionValidator,
    fileExistsValidator,
    sut
  }
}

describe('ConvertAudioFileValidator', () => {
  describe('validateConvertAudioFile', () => {
    test('should INullValidator to be called for each field', async () => {
      const { sut, nullValidator, convertAudioFileModel } = makeSut()
      const isNullSpy = jest.spyOn(nullValidator, 'isNull')
      await sut.validateConvertAudioFile(convertAudioFileModel)
      expect(isNullSpy).toHaveBeenCalled()
    })

    test('should IFileExtensionValidator to be called', async () => {
      const { sut, fileExtensionValidator, convertAudioFileModel } = makeSut()
      const isFileExtensionSpy = jest.spyOn(fileExtensionValidator, 'isFileExtension')
      await sut.validateConvertAudioFile(convertAudioFileModel)
      expect(isFileExtensionSpy).toBeCalledWith(convertAudioFileModel.originalFile)
    })

    test('should IFileExistsValidator to be called', async () => {
      const { sut, fileExistsValidator, convertAudioFileModel } = makeSut()
      const fileExistsSpy = jest.spyOn(fileExistsValidator, 'fileExists')
      await sut.validateConvertAudioFile(convertAudioFileModel)
      expect(fileExistsSpy).toBeCalledWith(convertAudioFileModel.path)
    })

    test('should return object with missing param error if some required field no exists', async () => {
      const { sut, nullValidator, convertAudioFileModel } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateConvertAudioFile(convertAudioFileModel)
      expect(result.mimeType.message).toMatch(/Missing param.*mimeType.*?/)
      expect(result.originalFile.message).toMatch(/Missing param.*originalFile.*?/)
      expect(result.path.message).toMatch(/Missing param.*path.*?/)
    })

    test('should return object with invalid param error if some field is invalid', async () => {
      const { sut, fileExtensionValidator, fileExistsValidator, convertAudioFileModel } = makeSut()
      jest.spyOn(fileExtensionValidator, 'isFileExtension').mockResolvedValue(false)
      jest.spyOn(fileExistsValidator, 'fileExists').mockResolvedValue(false)
      const result = await sut.validateConvertAudioFile({ ...convertAudioFileModel, mimeType: 1 } as any)
      expect(result.mimeType.message).toMatch(/Invalid param.*mimeType.*?/)
      expect(result.originalFile.message).toMatch(/Invalid param.*originalFile.*?/)
      expect(result.path.message).toMatch(/Invalid param.*path.*?/)
    })

    test('should return empty object if all fields is valid', async () => {
      const { sut, convertAudioFileModel } = makeSut()
      const result = await sut.validateConvertAudioFile(convertAudioFileModel)
      expect(Object.keys(result).length).toBe(0)
    })
  })
})
