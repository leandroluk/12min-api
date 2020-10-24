import { IUserModel } from '@/domain/models/user.model'

export interface IAddUserModel {
  email: string
  password: string
}

export interface IAddUser {
  insertUser(user: IAddUserModel): Promise<IUserModel>
}
