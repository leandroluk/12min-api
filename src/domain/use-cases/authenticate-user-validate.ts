export interface IAuthenticateUserValidateModel {
  email: string
  password: string
}

export interface IAuthenticateUserValidate {
  validateAuthenticateUser(user: IAuthenticateUserValidateModel): Promise<any>
}
