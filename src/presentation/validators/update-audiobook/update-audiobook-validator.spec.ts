import { INullValidator } from '../../protocols/null-validator'
import { UpdateAudiobookValidator } from './update-audiobook-validator'

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  sut: UpdateAudiobookValidator
} => {
  const nullValidator = makeNullValidator()
  const sut = new UpdateAudiobookValidator(
    nullValidator
  )

  return {
    nullValidator,
    sut
  }
}

describe('UpdateAudiobookValidator', () => {
  test('should call INullValidator for each field', async () => {
    const { sut, nullValidator } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateUpdateAudiobook({})
    expect(isNullSpy).toHaveBeenCalledTimes(3)
  })

  test('should return a object with invalid param error if some field is invalid', async () => {
    const { sut } = makeSut()
    const result = await sut.validateUpdateAudiobook({ title: 1, description: 1, tags: 1 } as any)
    expect(result.title.message).toMatch(/Invalid param.*title.*?/)
    expect(result.description.message).toMatch(/Invalid param.*description.*?/)
    expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
  })

  test('should return a object with invalid param error if some value inner tags is invalid', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull')
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
    const result = await sut.validateUpdateAudiobook({ tags: [1] } as any)
    expect(result.title).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
  })

  test('should return a empty object if all fields is empty', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateUpdateAudiobook({})
    expect(result.title).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.tags).toBeUndefined()
  })

  test('should return a empty object if all fields is valid', async () => {
    const { sut } = makeSut()
    const result = await sut.validateUpdateAudiobook({
      title: 'title',
      description: 'description',
      tags: ['tags']
    })
    expect(result.title).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.tags).toBeUndefined()
  })
})
