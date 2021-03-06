import { IEncrypter } from '../../../data/protocols/encrypter'
import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IUserWithPasswordModel } from '../../../domain/models/user.model'
import { IAuthenticateUserModel, IBearerTokenModel } from '../../../domain/use-cases/authenticate-user'
import { IAuthenticateUserValidate } from '../../../domain/use-cases/authenticate-user-validate'
import { IGetUserByEmail } from '../../../domain/use-cases/get-user-by-email'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { INullValidator } from '../../protocols/null-validator'
import { AuthenticateUserController } from './authenticate-user.controller'

const makeGetUser = (): IGetUserByEmail => {
  class GetUserRepositoryStub implements IGetUserByEmail {
    async getUserByEmail(email: string): Promise<IUserWithPasswordModel> {
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
    async validateAuthenticateUser(user: IAuthenticateUserModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new AuthenticateUserValidateStub()
}

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeEmptyValidator = (): IEmptyValidator => {
  class EmptyValidatorStub implements IEmptyValidator {
    async isEmpty(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async compare(_value: string, _hashed: string): Promise<boolean> {
      return await Promise.resolve(true)
    }

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

    async verify(_accessToken: string): Promise<any> {
      return await Promise.resolve({ key: 'value' })
    }
  }
  return new JwtTokenStub()
}

const makeSut = (): {
  getUserByEmailRepository: IGetUserByEmail
  authenticateUserValidator: IAuthenticateUserValidate
  nullValidator: INullValidator
  emptyValidator: IEmptyValidator
  encrypter: IEncrypter
  jwtToken: IJwtToken
  sut: AuthenticateUserController
  authenticateUserModel: IAuthenticateUserModel
} => {
  const getUserByEmailRepository = makeGetUser()
  const authenticateUserValidator = makeAuthenticateUserValidator()
  const nullValidator = makeNullValidator()
  const emptyValidator = makeEmptyValidator()
  const encrypter = makeEncrypter()
  const jwtToken = makeJwtToken()
  const sut = new AuthenticateUserController(
    getUserByEmailRepository,
    nullValidator,
    emptyValidator,
    authenticateUserValidator,
    encrypter,
    jwtToken
  )
  const authenticateUserModel: IAuthenticateUserModel = {
    email: 'any@email',
    password: '12312'
  }
  return {
    getUserByEmailRepository,
    authenticateUserValidator,
    nullValidator,
    emptyValidator,
    encrypter,
    jwtToken,
    sut,
    authenticateUserModel
  }
}

describe('AuthenticateUserController', () => {
  describe('handle', () => {
    test('should return 400 with missing param error if no have any body with user', async () => {
      const { sut, emptyValidator } = makeSut()
      jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
      const httpResponse = await sut.handle({ header: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body?.message).toMatch(/Missing param.*body.*?/)
    })

    test('should IEmptyValidator is called', async () => {
      const { sut, emptyValidator } = makeSut()
      const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(isEmptySpy).toHaveBeenCalled()
    })

    test('should IAuthenticateUserValidate is called', async () => {
      const { sut, authenticateUserValidator } = makeSut()
      const authenticateUserValidatorSpy = jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(authenticateUserValidatorSpy).toHaveBeenCalled()
    })

    test('should IJwtToken.generate is called with correct values', async () => {
      const { sut, authenticateUserValidator, jwtToken, getUserByEmailRepository: getUserRepository } = makeSut()
      jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser').mockResolvedValue({})
      jest.spyOn(getUserRepository, 'getUserByEmail').mockResolvedValue({
        id: 'id',
        email: 'email',
        password: 'password',
        createdAt: new Date()
      })

      const jwtTokenSpy = jest.spyOn(jwtToken, 'generate')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(jwtTokenSpy).toHaveBeenCalledWith('id')
    })

    test('should return 400 if body is invalid', async () => {
      const { sut, authenticateUserValidator } = makeSut()
      jest.spyOn(authenticateUserValidator, 'validateAuthenticateUser').mockResolvedValue({
        email: { message: '123' }
      })

      const httpResponse = await sut.handle({ body: {} as any })
      expect(httpResponse.body.message).toMatch(/Object validation/)
    })

    test('should return 404 if email no exist\'s', async () => {
      const { sut, getUserByEmailRepository, nullValidator } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      jest.spyOn(getUserByEmailRepository, 'getUserByEmail').mockResolvedValue(undefined)
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(404)
      expect(httpResponse.body.message).toMatch(/Not found/)
    })

    test('should return 401 if password is incorrect', async () => {
      const { sut, encrypter } = makeSut()
      jest.spyOn(encrypter, 'compare').mockResolvedValue(false)
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body.message).toMatch(/Unauthorized/)
    })

    test('should return 200 with bearer token if success', async () => {
      const { sut } = makeSut()
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.accessToken).toBeTruthy()
    })

    test('should return 500 if getUserRepository throws', async () => {
      const { sut, getUserByEmailRepository } = makeSut()
      jest.spyOn(getUserByEmailRepository, 'getUserByEmail').mockRejectedValue(new Error())
      const httpRequest = { body: { email: 'any@email.com', password: 'password' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    })
  })
})
