import { DbGetAudiobook } from '../../data/use-cases/db-get-audiobook/db-get-audiobook'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoGetAudiobookRepository } from '../../infra/db/mongodb/repos/get-audiobook.repository'
import { GetAudiobookController } from '../../presentation/controllers/get-audiobook/get-audiobook.controller'
import { AccessTokenValidatorAdapter } from '../../presentation/validators/access-token/access-token-validator-adapter'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import env from '../config/env'

export const makeGetAudiobookController = (): GetAudiobookController => {
  const emptyValidator = new EmptyValidatorAdapter()
  const nullValidator = new NullValidatorAdapter()
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)
  const accessTokenValidator = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const getAudiobookRepository = new MongoGetAudiobookRepository()
  const getAudiobook = new DbGetAudiobook(getAudiobookRepository)

  return new GetAudiobookController(
    emptyValidator,
    accessTokenValidator,
    getAudiobook
  )
}
