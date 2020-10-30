import { IUserModel } from '../../domain/models/user.model'

export interface IGetUserByEmailRepository {
  geUserByEmail(email: string): Promise<IUserModel>
}
