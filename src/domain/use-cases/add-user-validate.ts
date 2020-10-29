import { IAddUserModel } from './add-user'

export interface IAddUserValidate {
  validateAddUser(user: IAddUserModel): Promise<any>
}
