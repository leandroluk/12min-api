import { DbAddUser } from '../../data/use-cases/db-add-user'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { MongoAddUserRepository } from '../../infra/db/mongodb/repos/add-user.repository'
import { MongoGetUserByEmailRepository } from '../../infra/db/mongodb/repos/get-user-by-email.repository'
import { AddUserController } from '../../presentation/controllers/add-user/add-user.controller'
import { AddUserValidator } from '../../presentation/validators/add-user/add-user.validator'
import { EmailValidatorAdapter } from '../../validators/email/email-validator-adapter'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import { PasswordValidatorAdapter } from '../../validators/password/password-validator-adapter'
import env from '../config/env'

export const makeAddUserController = (): AddUserController => {
  const encrypterSalt = env.cryptography.salt
  const encrypter = new BcryptAdapter(encrypterSalt)
  const addUserRepository = new MongoAddUserRepository()
  const getUserRepository = new MongoGetUserByEmailRepository()
  const dbAddUser = new DbAddUser(addUserRepository, getUserRepository, encrypter)
  const nullValidator = new NullValidatorAdapter()
  const enptyValidator = new EmptyValidatorAdapter()
  const emailValidator = new EmailValidatorAdapter()
  const passwordValidator = new PasswordValidatorAdapter()
  const addUserValidator = new AddUserValidator(nullValidator, emailValidator, passwordValidator)

  return new AddUserController(dbAddUser, enptyValidator, addUserValidator)
}
