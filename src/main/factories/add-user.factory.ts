import { DbAddUser } from '../../data/use-cases/db-add-user'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { MongoAddUserRepository } from '../../infra/db/mongodb/repos/add-user.repository'
import { AddUserController } from '../../presentation/controllers/add-user/add-user.controller'
import { AddUserValidator } from '../../presentation/validators/add-user.validator'
import { EmailValidatorAdapter } from '../../validators/email-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null-validator-adapter'
import { PasswordValidatorAdapter } from '../../validators/password-validator-adapter'

export const makeAddUserController = (): AddUserController => {
  const encrypterSalt = 12
  const encrypter = new BcryptAdapter(encrypterSalt)
  const addUserRepository = new MongoAddUserRepository(encrypter)
  const dbAddUser = new DbAddUser(addUserRepository, encrypter)
  const nullValidator = new NullValidatorAdapter()
  const emailValidator = new EmailValidatorAdapter()
  const passwordValidator = new PasswordValidatorAdapter()
  const addUserValidator = new AddUserValidator(nullValidator, emailValidator, passwordValidator)

  return new AddUserController(dbAddUser, nullValidator, addUserValidator)
}
