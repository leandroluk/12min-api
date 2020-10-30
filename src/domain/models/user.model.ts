export interface IUserModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  email: string
}

export interface IUserModelWithPassword extends IUserModel {
  password: string
}
