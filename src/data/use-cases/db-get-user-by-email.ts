import { IUserModel } from '../../domain/models/user.model'
import { IGetUserByEmail } from '../../domain/use-cases/get-user-by-email'
import { IGetUserByEmailRepository } from '../protocols/get-user-by-email.repository'

export class DbGetUserByEmail implements IGetUserByEmail {
  constructor(
    readonly getUserRepository: IGetUserByEmailRepository
  ) { }

  async getUserByEmail(email: string): Promise<IUserModel> {
    return await this.getUserRepository.geUserByEmail(email)
  }
}
