import faker from 'faker'
import { IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { IFileExistsValidator } from '../../protocols/file-exists-validator'
import { IFileExtensionValidator } from '../../protocols/file-extension-validator'
import { INullValidator } from '../../protocols/null-validator'
import { AddAudiobookValidator } from './add-audiobook-validator'

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
    async fileExists(_path: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new FileExistsValidatorStub()
}

const makeSut = (): {
  addAudiobookModel: IAddAudiobookModel
  nullValidator: INullValidator
  fileExtensionValidator: IFileExtensionValidator
  fileExistsValidator: IFileExistsValidator
  sut: IAddAudiobookValidate
} => {
  const addAudiobookModel = {
    title: faker.name.title(),
    description: faker.random.words(4),
    filePath: 'file/path.mp3',
    tags: [faker.random.word()]
  }
  const nullValidator = makeNullValidator()
  const fileExtensionValidator = makeFileExtensionValidator()
  const fileExistsValidator = makeFileExistsValidator()
  const sut = new AddAudiobookValidator(nullValidator, fileExtensionValidator, fileExistsValidator)

  return {
    addAudiobookModel,
    nullValidator,
    fileExtensionValidator,
    fileExistsValidator,
    sut
  }
}

describe('AddAudiobookValidator', () => {
  describe('validateAddAudiobook', () => {
    test('should all validators to be called', async () => {
      const { sut, nullValidator, fileExtensionValidator, fileExistsValidator, addAudiobookModel } = makeSut()
      const isNullSpy = jest.spyOn(nullValidator, 'isNull')
      const isFileExtensionSpy = jest.spyOn(fileExtensionValidator, 'isFileExtension')
      const fileExistsSpy = jest.spyOn(fileExistsValidator, 'fileExists')
      await sut.validateAddAudiobook(addAudiobookModel)
      expect(isNullSpy).toHaveBeenCalled()
      expect(isFileExtensionSpy).toHaveBeenCalledWith(addAudiobookModel.filePath)
      expect(fileExistsSpy).toHaveBeenCalledWith(addAudiobookModel.filePath)
    })

    test('should return a object with missing param error if some required field isn\t provided', async () => {
      const { sut, nullValidator, addAudiobookModel } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateAddAudiobook(addAudiobookModel)
      expect(result.title.message).toMatch(/Missing param.*title.*?/)
      expect(result.description.message).toMatch(/Missing param.*description.*?/)
      expect(result.filePath.message).toMatch(/Missing param.*filePath.*?/)
      expect(result.tags.message).toMatch(/Missing param.*tags.*?/)
    })

    test('should return a object with invalid param error if some field is invalid', async () => {
      const { sut, fileExtensionValidator, fileExistsValidator } = makeSut()
      let result

      result = await sut.validateAddAudiobook({ title: 1, description: 1, filePath: 1, tags: 1 } as any)
      expect(result.title.message).toMatch(/Invalid param.*title.*?/)
      expect(result.description.message).toMatch(/Invalid param.*description.*?/)
      expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)

      jest.spyOn(fileExtensionValidator, 'isFileExtension').mockResolvedValueOnce(false)
      result = await sut.validateAddAudiobook({ title: 1, description: 1, filePath: 1, tags: 1 } as any)
      expect(result.filePath.message).toMatch(/Invalid param.*filePath.*?/)

      jest.spyOn(fileExistsValidator, 'fileExists').mockResolvedValueOnce(false)
      result = await sut.validateAddAudiobook({ title: 1, description: 1, filePath: 1, tags: 1 } as any)
      expect(result.filePath.message).toMatch(/Invalid param.*filePath.*?/)
    })

    test('should return a object with invalid param error if some value inner tags is invalid', async () => {
      const { sut, addAudiobookModel } = makeSut()

      const result = await sut.validateAddAudiobook({ ...addAudiobookModel, tags: [1] } as any)
      expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
    })
  })
})
