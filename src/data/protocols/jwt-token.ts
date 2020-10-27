import { IBearerTokenModel } from '../../domain/use-cases/authenticate-user'

export interface IJwtToken {
  generate(userId: string): Promise<IBearerTokenModel>
  verify(accessToken: string): Promise<boolean>
}
