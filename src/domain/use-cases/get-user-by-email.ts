import { IUserModel } from '../models/user.model'

export interface IGetUserByEmail {
  getUserByEmail(email: string): Promise<IUserModel>
}
