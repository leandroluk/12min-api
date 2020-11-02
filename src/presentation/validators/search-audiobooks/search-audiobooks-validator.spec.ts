import { INullValidator } from '../../protocols/null-validator'
import { SearchAudiobooksValidator } from './search-audiobooks-validator'

const makeNullvalidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  queryLimit: number
  queryLimitSeparator: string
  sut: SearchAudiobooksValidator
} => {
  const nullValidator = makeNullvalidator()
  const queryLimit = 50
  const queryLimitSeparator = ','
  const sut = new SearchAudiobooksValidator(
    nullValidator,
    queryLimit,
    queryLimitSeparator
  )

  return {
    nullValidator,
    queryLimit,
    queryLimitSeparator,
    sut
  }
}

describe('SearchAudiobooksValidator', () => {
  test('should call INullValidator', async () => {
    const { sut, nullValidator } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateSearchAudiobooks({})
    expect(isNullSpy).toHaveBeenCalled()
  })

  test('should return an object with invalid param erros if some value are invalid', async () => {
    const { sut } = makeSut()
    const result = await sut.validateSearchAudiobooks({ offset: 1, limit: 1, title: 1, description: 1, tags: 1 } as any)
    expect(result.offset.message).toMatch(/Invalid param.*/)
    expect(result.limit.message).toMatch(/Invalid param.*/)
    expect(result.title.message).toMatch(/Invalid param.*/)
    expect(result.description.message).toMatch(/Invalid param.*/)
    expect(result.tags.message).toMatch(/Invalid param.*/)
  })

  test('should return empty object if all params is valid', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateSearchAudiobooks({})
    expect(Object.keys(result).length).toBe(0)
  })
})
