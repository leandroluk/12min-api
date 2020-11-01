import { IUserWithPasswordModel } from '../models/user.model'

export interface IGetUserByEmail {
  getUserByEmail(email: string): Promise<IUserWithPasswordModel>
}
