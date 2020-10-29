import { IAuthenticateUserModel } from './authenticate-user'

export interface IAuthenticateUserValidate {
  validateAuthenticateUser(user: IAuthenticateUserModel): Promise<any>
}
