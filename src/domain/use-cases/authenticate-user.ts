export interface IAuthenticateUserModel {
  email: string
  password: string
}

export interface IBearerTokenModel {
  accessToken: string
  tokenType: string
  expiresIn: number
  userId: string
}

export interface IAuthenticateUser {
  authenticateUser(user: IAuthenticateUser): Promise<IBearerTokenModel>
}
