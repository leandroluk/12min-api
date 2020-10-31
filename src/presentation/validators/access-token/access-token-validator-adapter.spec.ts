import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IUserModel } from '../../../domain/models/user.model'
import { IBearerTokenModel } from '../../../domain/use-cases/authenticate-user'
import { IGetUser } from '../../../domain/use-cases/get-user'
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

const makeGetUser = (): IGetUser => {
  class GetUserStub implements IGetUser {
    async getUser(userId: string): Promise<IUserModel> {
      return await Promise.resolve({
        id: userId,
        createdAt: new Date(),
        email: 'a@a.com'
      })
    }
  }
  return new GetUserStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  jwtToken: IJwtToken
  getUser: IGetUser
  sut: AccessTokenValidatorAdapter
} => {
  const nullValidator = makeNullValidator()
  const jwtToken = makeJwtToken()
  const getUser = makeGetUser()
  const sut = new AccessTokenValidatorAdapter(nullValidator, jwtToken, getUser)

  return {
    nullValidator,
    jwtToken,
    getUser,
    sut
  }
}

describe('AccessTokenValidatorAdapter', () => {
  test('should call INullValidator.isNull', async () => {
    const { sut, nullValidator } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.validateAccessToken('Bearer token')
    expect(isNullSpy).toHaveBeenCalled()
  })

  test('should call IJwtToken.verify', async () => {
    const { sut, jwtToken } = makeSut()
    const verifySpy = jest.spyOn(jwtToken, 'verify')
    await sut.validateAccessToken('Bearer token')
    expect(verifySpy).toHaveBeenCalled()
  })

  test('should call IGetUser.getUser', async () => {
    const { sut, getUser } = makeSut()
    const getUserSpy = jest.spyOn(getUser, 'getUser')
    await sut.validateAccessToken('Bearer token')
    expect(getUserSpy).toHaveBeenCalled()
  })

  test('should return false if nullValidator throws', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockRejectedValue(new Error())
    await expect(sut.validateAccessToken('Bearer token')).resolves.toBeFalsy()
  })

  test('should return false if jwtToken throws', async () => {
    const { sut, jwtToken } = makeSut()
    jest.spyOn(jwtToken, 'verify').mockRejectedValue(new Error())
    await expect(sut.validateAccessToken('Bearer token')).resolves.toBeFalsy()
  })

  test('should return false if getUser throws', async () => {
    const { sut, getUser } = makeSut()
    jest.spyOn(getUser, 'getUser').mockRejectedValue(new Error())
    await expect(sut.validateAccessToken('Bearer token')).resolves.toBeFalsy()
  })

  test('should return false if null', async () => {
    const { sut, nullValidator } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.validateAccessToken('Bearer token')
    expect(result).toBeFalsy()
  })

  test('should return false if access token is invalid or expired', async () => {
    const { sut, jwtToken } = makeSut()
    jest.spyOn(jwtToken, 'verify').mockResolvedValue(false)
    const result = await sut.validateAccessToken('Bearer token')
    expect(result).toBeFalsy()
  })

  test('should return true if success', async () => {
    const { sut } = makeSut()
    await expect(sut.validateAccessToken('Bearer token')).resolves.toBeTruthy()
  })
})
