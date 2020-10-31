import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IGetUser } from '../../../domain/use-cases/get-user'
import { INullValidator } from '../../protocols/null-validator'

export class AccessTokenValidatorAdapter implements IAccessTokenValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly jwtToken: IJwtToken,
    readonly getUser: IGetUser
  ) { }

  async validateAccessToken(accessToken: any): Promise<boolean> {
    try {
      const [, token] = accessToken.split(' ')
      const [isNull, verified] = await Promise.all([
        this.nullValidator.isNull(token),
        this.jwtToken.verify(token)
      ])
      if (!isNull && verified) {
        const { userId } = verified
        const user = await this.getUser.getUser(userId)
        return !!user
      }
    } catch (error) { }
    return false
  }
}
