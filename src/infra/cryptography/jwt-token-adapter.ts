import jwt from 'jsonwebtoken'
import { IJwtToken } from '../../data/protocols/jwt-token'
import { IBearerTokenModel } from '../../domain/use-cases/authenticate-user'

export class JwtTokenAdapter implements IJwtToken {
  constructor(
    readonly secret: string,
    readonly expiresIn: number
  ) { }

  async generate(userId: string): Promise<IBearerTokenModel> {
    return await new Promise((resolve, reject) => {
      try {
        resolve({
          accessToken: jwt.sign({ userId }, this.secret, { expiresIn: this.expiresIn }),
          tokenType: 'bearer',
          expiresIn: this.expiresIn,
          userId
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async verify(accessToken: string): Promise<boolean> {
    return await new Promise(resolve => {
      jwt.verify(accessToken, this.secret, (err: Error) => {
        resolve(!err)
      })
    })
  }
}
