import faker from 'faker'
import { IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
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

const makeSut = (): {
  addAudiobookModel: IAddAudiobookModel
  nullValidator: INullValidator
  sut: IAddAudiobookValidate
} => {
  const addAudiobookModel = {
    title: faker.name.title(),
    description: faker.random.words(4),
    tags: [faker.random.word()]
  }
  const nullValidator = makeNullValidator()
  const sut = new AddAudiobookValidator(nullValidator)

  return {
    addAudiobookModel,
    nullValidator,
    sut
  }
}

describe('AddAudiobookValidator', () => {
  describe('validateAddAudiobook', () => {
    test('should return a object with missing param error if some required field isn\t provided', async () => {
      const { sut, nullValidator, addAudiobookModel } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateAddAudiobook(addAudiobookModel)
      expect(result.title.message).toMatch(/Missing param.*title.*?/)
      expect(result.description.message).toMatch(/Missing param.*description.*?/)
      expect(result.tags.message).toMatch(/Missing param.*tags.*?/)
    })

    test('should return a object with invalid param error if some field is invalid', async () => {
      const { sut } = makeSut()
      const result = await sut.validateAddAudiobook({ title: 1, description: 1, tags: 1 } as any)
      expect(result.title.message).toMatch(/Invalid param.*title.*?/)
      expect(result.description.message).toMatch(/Invalid param.*description.*?/)
      expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
    })

    test('should return a object with invalid param error if some value inner tags is invalid', async () => {
      const { sut, addAudiobookModel } = makeSut()

      const result = await sut.validateAddAudiobook({ ...addAudiobookModel, tags: [1] } as any)
      expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
    })
  })
})
