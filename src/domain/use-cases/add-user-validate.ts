export interface IAddUserValidateModel {
  email: string
  password: string
}

export interface IAddUserValidate {
  validateAddUser(user: IAddUserValidateModel): Promise<any>
}
