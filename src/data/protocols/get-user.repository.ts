import { IUserModel } from '../../domain/models/user.model'

export interface IGetUserRepository {
  geUserByEmail(email: string): Promise<IUserModel>
}
