import { DbGetUserByEmail } from '../../data/use-cases/db-get-user-by-email'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoGetUserRepository } from '../../infra/db/mongodb/repos/get-user.repository'
import { AuthenticateUserController } from '../../presentation/controllers/authenticate-user/authenticate-user.controller'
import { AuthenticateUserValidator } from '../../presentation/validators/authenticate-user.validator'
import { EmailValidatorAdapter } from '../../validators/email-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null-validator-adapter'
import { PasswordValidatorAdapter } from '../../validators/password-validator-adapter'
import env from '../config/env'

export const makeAuthenticateUserController = (): AuthenticateUserController => {
  const getUserRepository = new MongoGetUserRepository()
  const dbGetUser = new DbGetUserByEmail(getUserRepository)
  const nullValidator = new NullValidatorAdapter()
  const emailValidator = new EmailValidatorAdapter()
  const passwordValidator = new PasswordValidatorAdapter()
  const authenticateUserValidator = new AuthenticateUserValidator(
    nullValidator,
    emailValidator,
    passwordValidator
  )
  const salt = env.cryptography.salt
  const encrypter = new BcryptAdapter(salt)
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)

  return new AuthenticateUserController(
    dbGetUser,
    nullValidator,
    authenticateUserValidator,
    encrypter,
    jwtToken
  )
}
