import { IUserModel } from '@/domain/models/user.model'
import { IAddUser, IAddUserModel } from '@/domain/use-cases/add-user'
import { IAddUserRepository } from '../protocols/add-user.repository'
import { IEncrypter } from '../protocols/encrypter'

export class DbAddUser implements IAddUser {
  constructor(
    readonly addUserRepository: IAddUserRepository,
    readonly encrypter: IEncrypter
  ) { }

  async addUser(user: IAddUserModel): Promise<IUserModel> {
    const data = { ...user }
    data.password = await this.encrypter.encrypt(user.password)
    return await this.addUserRepository.addUser(data)
  }
}
