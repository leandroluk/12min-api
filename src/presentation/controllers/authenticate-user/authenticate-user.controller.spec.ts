import { IEncrypter } from '../../../data/protocols/encrypter'
import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IUserModel } from '../../../domain/models/user.model'
import { IBearerTokenModel } from '../../../domain/use-cases/authenticate-user'
import { IAuthenticateUserValidate, IAuthenticateUserValidateModel } from '../../../domain/use-cases/authenticate-user-validate'
import { IGetUserByEmail } from '../../../domain/use-cases/get-user-by-email'
import { IController } from '../../protocols/controller'
import { INullValidator } from '../../protocols/null-validator'
import { AuthenticateUserController } from './authenticate-user.controller'

const makeGetUser = (): IGetUserByEmail => {
  class GetUserRepositoryStub implements IGetUserByEmail {
    async getUserByEmail(email: string): Promise<IUserModel> {
      return await Promise.resolve({
        id: 'id',
        email,
        password: 'password',
        createdAt: new Date()
      })
    }
  }
  return new GetUserRepositoryStub()
}

const makeAuthenticateUserValidator = (): IAuthenticateUserValidate => {
  class AuthenticateUserValidateStub implements IAuthenticateUserValidate {
    async validateAuthenticateUser(user: IAuthenticateUserValidateModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new AuthenticateUserValidateStub()
}

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new NullValidatorStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed')
    }
  }
  return new EncrypterStub()
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
  getUserByEmailRepository: IGetUserByEmail
  authenticateUserValidator: IAuthenticateUserValidate
  nullValidator: INullValidator
  encrypter: IEncrypter
  jwtToken: IJwtToken
  sut: IController
} => {
  const getUserByEmailRepository = makeGetUser()
  const authenticateUserValidator = makeAuthenticateUserValidator()
  const nullValidator = makeNullValidator()
  const encrypter = makeEncrypter()
  const jwtToken = makeJwtToken()
  const sut = new AuthenticateUserController(
    getUserByEmailRepository,
    nullValidator,
    authenticateUserValidator,
    encrypter,
    jwtToken
  )

  return {
    getUserByEmailRepository,
    authenticateUserValidator,
    nullValidator,
    encrypter,
    jwtToken,
    sut
  }
}

describe('AuthenticateUserController', () => {
  describe('handle', () => {
    test('should return 400 with missing param error if no have any body with user', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({ header: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body?.message).toMatch(/Missing param.*body/)
    })

    test('should IAuthenticateUserValidate.validateAuthenticateUser is called', async () => {
      const { sut, authenticateUserValidator, nullValidator } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(false)
      const authenticateUserValidatorSpy = jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(authenticateUserValidatorSpy).toBeCalled()
    })

    test('should IJwtToken.generate is called with correct values', async () => {
      const { sut, nullValidator, authenticateUserValidator, jwtToken, getUserByEmailRepository: getUserRepository, encrypter } = makeSut()

      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(false)
      jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser').mockResolvedValue({})
      jest.spyOn(encrypter, 'encrypt').mockResolvedValue('password')
      jest.spyOn(getUserRepository, 'getUserByEmail').mockResolvedValue({
        id: 'id',
        email: 'email',
        password: 'password',
        createdAt: new Date()
      })

      const jwtTokenSpy = jest.spyOn(jwtToken, 'generate')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(jwtTokenSpy).toBeCalledWith('id')
    })

    test('should return 400 if body is invalid', async () => {
      const { sut, nullValidator, authenticateUserValidator } = makeSut()

      jest.spyOn(nullValidator, 'isNull').mockResolvedValueOnce(false)
      jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser').mockResolvedValue({
        email: { message: '123' }
      })

      const httpResponse = await sut.handle({ body: {} })
      expect(httpResponse.body.message).toMatch(/Object validation/)
    })

    test('should return 404 if email no exist\'s', async () => {
      const { sut, getUserByEmailRepository: getUserRepository, nullValidator } = makeSut()

      jest.spyOn(nullValidator, 'isNull')
        .mockResolvedValueOnce(false)
        .mockResolvedValue(true)

      jest.spyOn(getUserRepository, 'getUserByEmail').mockResolvedValue(undefined)
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(404)
      expect(httpResponse.body.message).toMatch(/Not found/)
    })

    test('should return 401 if password is incorrect', async () => {
      const { sut, nullValidator } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(false)
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body.message).toMatch(/Unauthorized/)
    })

    test('should return 200 with bearer token if success', async () => {
      const { sut, nullValidator, encrypter } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(false)
      jest.spyOn(encrypter, 'encrypt').mockResolvedValue('password')
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.accessToken).toBeTruthy()
    })
  })
})
