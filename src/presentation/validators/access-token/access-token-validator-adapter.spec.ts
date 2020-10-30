import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IBearerTokenModel } from '../../../domain/use-cases/authenticate-user'
import { INullValidator } from '../../protocols/null-validator'
import { AccessTokenValidatorAdapter } from './access-token-validator-adapter'

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeJwtToken = (): IJwtToken => {
  class JwtTokenStub implements IJwtToken {
    async generate(userId: string): Promise<IBearerTokenModel> {
      return await Promise.resolve({
        accessToken: 'token',
        expiresIn: 3600,
        tokenType: 'bearer',
        userId
      })
    }

    async verify(_accessToken: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new JwtTokenStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  jwtToken: IJwtToken
  sut: AccessTokenValidatorAdapter
} => {
  const nullValidator = makeNullValidator()
  const jwtToken = makeJwtToken()
  const sut = new AccessTokenValidatorAdapter(nullValidator, jwtToken)

  return {
    nullValidator,
    jwtToken,
    sut
  }
}

describe('AccessTokenValidatorAdapter', () => {
  test('should call INullValidator', async () => {
    const { sut, nullValidator } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateAccessToken('token')
    expect(isNullSpy).toBeCalled()
  })

  test('should call IJwtToken.verify', async () => {
    const { sut, jwtToken } = makeSut()
    const verifySpy = jest.spyOn(jwtToken, 'verify')
    await sut.validateAccessToken('token')
    expect(verifySpy).toBeCalled()
  })

  test('should return false if null', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateAccessToken('token')
    expect(result).toBeFalsy()
  })

  test('should return false if access token is invalid or expired', async () => {
    const { sut, jwtToken } = makeSut()
    jest.spyOn(jwtToken, 'verify').mockResolvedValue(false)
    const result = await sut.validateAccessToken('token')
    expect(result).toBeFalsy()
  })

  test('should return true if success', async () => {
    const { sut } = makeSut()
    await expect(sut.validateAccessToken('token')).resolves.toBeTruthy()
  })
})
