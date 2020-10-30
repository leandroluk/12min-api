import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { INullValidator } from '../../protocols/null-validator'

export class AccessTokenValidatorAdapter implements IAccessTokenValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly jwtToken: IJwtToken
  ) { }

  async validateAccessToken(accessToken: any): Promise<boolean> {
    const [isNull, verified] = await Promise.all([
      this.nullValidator.isNull(accessToken),
      this.jwtToken.verify(accessToken)
    ])
    return !isNull && verified
  }
}
