import { INullValidator } from '../../protocols/null-validator'
import { SearchAudiobooksValidator } from './search-audiobooks-validator'

const makeNullvalidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
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

  test('should return an object with invalid param errors if some value are invalid', async () => {
    const { sut, queryLimit, queryLimitSeparator } = makeSut()
    let result: any

    const invalid = {
      offset: [1, 'a', '-1'],
      limit: [1, 'a', '-1', queryLimit + 1],
      title: [1],
      description: [1],
      tags: [`${queryLimitSeparator}`]
    }

    for (const [key, values] of Object.entries(invalid)) {
      for (const value of values) {
        result = await sut.validateSearchAudiobooks({ [key]: value } as any)
        expect(result[key].message).toBeDefined()
      }
    }
  })

  test('should return empty object if all params are null', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateSearchAudiobooks({})
    expect(Object.keys(result).length).toBe(0)
  })

  test('should return empty object if all params have valid values', async () => {
    const { sut, queryLimit, queryLimitSeparator } = makeSut()
    const valid = {
      offset: ['1'],
      limit: ['1', queryLimit + ''],
      title: ['title'],
      description: ['description'],
      tags: [`tag1${queryLimitSeparator}tag2`]
    }

    for (const [key, values] of Object.entries(valid)) {
      for (const value of values) {
        const result = await sut.validateSearchAudiobooks({ [key]: value } as any)
        expect(result[key]).toBeUndefined()
      }
    }
  })

  test('should return limit error if limit value is greater than this.queryLimit on sut', async () => {
    const { sut, queryLimit } = makeSut()
    const result = await sut.validateSearchAudiobooks({ limit: `${queryLimit + 1}` })
    expect(result.limit).toBeDefined()
  })
})
