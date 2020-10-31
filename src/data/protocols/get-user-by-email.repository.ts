import { IUserWithPasswordModel } from '../../domain/models/user.model'

export interface IGetUserByEmailRepository {
  getUserByEmail(email: string): Promise<IUserWithPasswordModel>
}
