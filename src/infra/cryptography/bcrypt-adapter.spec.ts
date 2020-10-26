import bcrypt from 'bcrypt'
import { IEncrypter } from '../../data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

const makeStut = (): {
  salt: number
  sut: IEncrypter
} => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    salt,
    sut
  }
}

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hashed')
  }
}))

describe('BcryptAdapter', () => {
  test('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeStut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on success', async () => {
    const { sut } = makeStut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed')
  })

  test('should throw if bcrypt throws', async () => {
    const { sut } = makeStut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error())
    await expect(sut.encrypt('any_value')).rejects.toThrow()
  })
})
