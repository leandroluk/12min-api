import { IUserModel } from '../../../domain/models/user.model'
import { IGetUser } from '../../../domain/use-cases/get-user'
import { IGetUserRepository } from '../../protocols/get-user.repository'

export class DbGetUser implements IGetUser {
  constructor(
    readonly getUserRepository: IGetUserRepository
  ) { }

  async getUser(userId: string): Promise<IUserModel> {
    return await this.getUserRepository.getUser(userId)
  }
}
