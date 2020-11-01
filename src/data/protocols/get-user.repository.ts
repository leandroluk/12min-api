import { IUserModel } from '../../domain/models/user.model'

export interface IGetUserRepository {
  getUser(userId: string): Promise<IUserModel>
}
