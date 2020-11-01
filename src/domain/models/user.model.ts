export interface IUserModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  email: string
}

export interface IUserWithPasswordModel extends IUserModel {
  password: string
}
