import { DbRemoveAudiobook } from '../../data/use-cases/db-remove-audiobook'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoRemoveAudiobookRepository } from '../../infra/db/mongodb/repos/remove-audiobook.repository'
import { RemoveAudiobookController } from '../../presentation/controllers/remove-audiobook/remove-audiobook.controller'
import { AccessTokenValidatorAdapter } from '../../presentation/validators/access-token/access-token-validator-adapter'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import env from '../config/env'

export const makeRemoveAudiobookController = (): RemoveAudiobookController => {
  const emptyValidator = new EmptyValidatorAdapter()
  const nullValidator = new NullValidatorAdapter()
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)
  const accessTokenValidator = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const removeAudiobookRepository = new MongoRemoveAudiobookRepository()
  const removeAudiobook = new DbRemoveAudiobook(removeAudiobookRepository)

  return new RemoveAudiobookController(
    emptyValidator,
    accessTokenValidator,
    removeAudiobook
  )
}
