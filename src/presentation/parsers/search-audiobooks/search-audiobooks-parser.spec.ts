import { IEmptyValidator } from '../../protocols/empty-validator'
import { SearchAudiobooksParser } from './search-audiobooks-parser'

const makeEmptyValidator = (): IEmptyValidator => {
  class EmptyValidatorStub implements IEmptyValidator {
    async isEmpty(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeSut = (): {
  emptyValidator: IEmptyValidator
  defaultLimit: number
  sut: SearchAudiobooksParser
} => {
  const emptyValidator = makeEmptyValidator()
  const defaultLimit = 50
  const sut = new SearchAudiobooksParser(
    emptyValidator,
    defaultLimit
  )

  return {
    emptyValidator,
    defaultLimit,
    sut
  }
}

describe('SearchAudiobooksParser', () => {
  test('should call IEmptyValidator', async () => {
    const { sut, emptyValidator } = makeSut()
    const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
    await sut.parseSearchAudiobooks({})
    expect(isEmptySpy).toBeCalled()
  })

  test('should throw if IEmptyValidator throws', async () => {
    const { sut, emptyValidator } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockRejectedValueOnce(new Error())
    await expect(sut.parseSearchAudiobooks({})).rejects.toThrow()
  })

  test('should return 0 on offset if no pass or negative or invalid', async () => {
    const { sut } = makeSut()
    const invalid = [undefined, null, true, '', -1]
    for (const offset of invalid) {
      expect((await sut.parseSearchAudiobooks({ offset } as any)).offset).toBe(0)
    }
  })

  test('should return 50 on limit if no pass or negative or gte defaultLimit or invalid', async () => {
    const { sut, defaultLimit } = makeSut()
    const invalid = [undefined, null, true, '', -1, defaultLimit + 1]
    for (const limit of invalid) {
      expect((await sut.parseSearchAudiobooks({ limit } as any)).limit).toBe(defaultLimit)
    }
  })

  test('should return empty string on title if is no passed', async () => {
    const { sut, emptyValidator } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    expect((await sut.parseSearchAudiobooks({})).title).toBe('')
  })

  test('should return empty string on description if is no passed', async () => {
    const { sut, emptyValidator } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    expect((await sut.parseSearchAudiobooks({})).description).toBe('')
  })

  test('should return empty array if tags is no passed', async () => {
    const { sut, emptyValidator } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    expect((await sut.parseSearchAudiobooks({})).tags).toEqual([])
  })

  test('should return parsed data correctly if fields are valid', async () => {
    const { sut } = makeSut()
    const parsed = await sut.parseSearchAudiobooks({
      offset: '1',
      limit: '1',
      title: 'title',
      description: 'description',
      tags: 'tag1,tag2,tag3'
    })
    expect(parsed.offset).toBe(1)
    expect(parsed.limit).toBe(1)
    expect(parsed.title).toBe('title')
    expect(parsed.description).toBe('description')
    expect(parsed.tags.length).toBe(3)
  })

  test('should return parsed tags without repeat', async () => {
    const { sut } = makeSut()
    const parsed = await sut.parseSearchAudiobooks({ tags: 'tag,tag,tag' })
    expect(parsed.tags.length).toBe(1)
  })
})
