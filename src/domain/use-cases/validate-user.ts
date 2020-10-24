export interface IValidateUserModel {
  email: string
  password: string
}

export interface IValidateUser {
  validateUser(user: IValidateUserModel): Promise<any>
}
