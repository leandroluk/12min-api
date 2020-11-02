import jwt from 'jsonwebtoken'
import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IBearerTokenModel } from '../../../domain/use-cases/authenticate-user'
import env from '../../../main/config/env'
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

    async verify(_accessToken: string): Promise<any> {
      return await Promise.resolve({ userId: 'userId' })
    }
  }
  return new JwtTokenStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  jwtToken: IJwtToken
  sut: AccessTokenValidatorAdapter
  accessToken: string
} => {
  const nullValidator = makeNullValidator()
  const jwtToken = makeJwtToken()
  const sut = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const accessToken = jwt.sign({ userId: 'userid' }, env.authentication.secret)

  return {
    nullValidator,
    jwtToken,
    sut,
    accessToken
  }
}

describe('AccessTokenValidatorAdapter', () => {
  test('should call INullValidator.isNull', async () => {
    const { sut, nullValidator, accessToken } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateAccessToken(accessToken)
    expect(isNullSpy).toHaveBeenCalled()
  })

  test('should call IJwtToken.verify', async () => {
    const { sut, jwtToken, accessToken } = makeSut()
    const verifySpy = jest.spyOn(jwtToken, 'verify')
    await sut.validateAccessToken(accessToken)
    expect(verifySpy).toHaveBeenCalled()
  })

  test('should return false if nullValidator throws', async () => {
    const { sut, nullValidator, accessToken } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockRejectedValue(new Error())
    await expect(sut.validateAccessToken(accessToken)).resolves.toBeFalsy()
  })

  test('should return false if jwtToken throws', async () => {
    const { sut, jwtToken, accessToken } = makeSut()
    jest.spyOn(jwtToken, 'verify').mockRejectedValue(new Error())
    await expect(sut.validateAccessToken(accessToken)).resolves.toBeFalsy()
  })

  test('should return false if null', async () => {
    const { sut, nullValidator, accessToken } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateAccessToken(accessToken)
    expect(result).toBeFalsy()
  })

  test('should return false if access token is invalid or expired', async () => {
    const { sut, jwtToken, accessToken } = makeSut()
    jest.spyOn(jwtToken, 'verify').mockResolvedValue(false)
    const result = await sut.validateAccessToken(accessToken)
    expect(result).toBeFalsy()
  })

  test('should return true if success and in token has userId field', async () => {
    const { sut, accessToken } = makeSut()
    await expect(sut.validateAccessToken(accessToken)).resolves.toBeTruthy()
  })

  test('should return false if IJwtToken.verify no have userId field', async () => {
    const { sut, jwtToken, accessToken } = makeSut()
    for (const resolved of ['a', {}, { userId: undefined }]) {
      jest.spyOn(jwtToken, 'verify').mockResolvedValue(resolved)
      await expect(sut.validateAccessToken(accessToken)).resolves.toBeFalsy()
    }
  })
})
