import { IUserModel } from '../../domain/models/user.model'
import { IAddUser, IAddUserModel } from '../../domain/use-cases/add-user'
import { EmailInUseError } from '../../errors/email-in-use/email-in-use.error'
import { IAddUserRepository } from '../protocols/add-user.repository'
import { IEncrypter } from '../protocols/encrypter'
import { IGetUserByEmailRepository } from '../protocols/get-user-by-email.repository'

export class DbAddUser implements IAddUser {
  constructor(
    readonly addUserRepository: IAddUserRepository,
    readonly getUserRepository: IGetUserByEmailRepository,
    readonly encrypter: IEncrypter
  ) { }

  async addUser(user: IAddUserModel): Promise<IUserModel> {
    const data = { ...user }

    const existingUser = await this.getUserRepository.geUserByEmail(data.email)

    if (existingUser) {
      throw new EmailInUseError(data.email)
    }

    data.password = await this.encrypter.encrypt(user.password)
    return await this.addUserRepository.addUser(data)
  }
}
