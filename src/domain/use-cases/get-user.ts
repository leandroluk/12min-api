import { IUserModel } from '../models/user.model'

export interface IGetUser {
  getUser(userId: string): Promise<IUserModel>
}
