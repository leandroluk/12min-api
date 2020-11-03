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
  test('should all validators to be called', async () => {
    const { sut, nullValidator } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateUpdateAudiobook({})
    expect(isNullSpy).toHaveBeenCalled()
  })

  test('should return a object with invalid param error if some field is invalid', async () => {
    const { sut } = makeSut()
    const result = await sut.validateUpdateAudiobook({ title: 1, description: 1, tags: 1 } as any)
    expect(result.title.message).toMatch(/Invalid param.*title.*?/)
    expect(result.description.message).toMatch(/Invalid param.*description.*?/)
    expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
  })

  test('should return a object with invalid param error if some value inner tags is invalid', async () => {
    const { sut } = makeSut()
    const result = await sut.validateUpdateAudiobook({ tags: [1] } as any)
    expect(result.tags.message).toMatch(/Invalid param.*tags.*?/)
  })
})
