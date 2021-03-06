import jwt from 'jsonwebtoken'
import { IJwtToken } from '../../data/protocols/jwt-token'
import { JwtTokenAdapter } from './jwt-token-adapter'


const makeStut = (expiresIn: number = 1000 * 60 * 60 /* 1 hour */): {
  expiresIn: number
  sut: IJwtToken
} => {
  const sut = new JwtTokenAdapter('secret', expiresIn)

  return {
    expiresIn,
    sut
  }
}

jest.mock('jsonwebtoken', () => ({
  sign(_data: any, _secret: string, _options: any): string {
    return 'token'
  },
  verify(_data: any, _secret: any, cb: (err: Error, value: any) => void): void {
    return cb(null, { key: 'value' })
  }
}))

describe('JwtTokenAdapter', () => {
  test('should call jwt with correct values', async () => {
    const { sut, expiresIn } = makeStut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_value')
    expect(signSpy).toHaveBeenCalledWith({ userId: 'any_value' }, 'secret', { expiresIn })
  })

  test('should return a bearer token on success', async () => {
    const { sut, expiresIn } = makeStut()
    const result = await sut.generate('any_value')

    expect(result.accessToken).toBe('token')
    expect(result.expiresIn).toBe(expiresIn)
    expect(result.tokenType).toBe('bearer')
    expect(result.userId).toBe('any_value')
  })

  test('should throw if jwt throws', async () => {
    const { sut } = makeStut()
    jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error() })
    await expect(sut.generate('any_value')).rejects.toThrow()
  })

  test('should return jwt data if jwt return jwt data', async () => {
    const { sut } = makeStut()
    const result = await sut.verify('any_value')
    expect(result.key).toBe('value')
  })
})
