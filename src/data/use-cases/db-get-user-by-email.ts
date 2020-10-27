import { IUserModel } from '../../domain/models/user.model'
import { IGetUserByEmail } from '../../domain/use-cases/get-user-by-email'
import { IGetUserRepository } from '../protocols/get-user.repository'

export class DbGetUserByEmail implements IGetUserByEmail {
  constructor(
    readonly getUserRepository: IGetUserRepository
  ) { }

  async getUserByEmail(email: string): Promise<IUserModel> {
    return await this.getUserRepository.geUserByEmail(email)
  }
}
