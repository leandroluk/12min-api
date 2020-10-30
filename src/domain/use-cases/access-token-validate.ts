export interface IAccessTokenValidate {
  validateAccessToken(accessToken: any): Promise<boolean>
}
