export interface IUserModel {
  id: string
  createdAt: Date
  updatedAt?: Date
  email: string
  password: string
  secret: string
}
