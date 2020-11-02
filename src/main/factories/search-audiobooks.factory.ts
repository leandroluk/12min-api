import { DbSearchAudiobooks } from '../../data/use-cases/db-search-audiobooks/db-search-audiobooks'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoSearchAudiobooksRepository } from '../../infra/db/mongodb/repos/search-audiobooks/search-audiobooks.repository'
import { SearchAudiobooksController } from '../../presentation/controllers/search-audiobooks/search-audiobooks.controller'
import { SearchAudiobooksParser } from '../../presentation/parsers/search-audiobooks/search-audiobooks-parser'
import { AccessTokenValidatorAdapter } from '../../presentation/validators/access-token/access-token-validator-adapter'
import { SearchAudiobooksValidator } from '../../presentation/validators/search-audiobooks/search-audiobooks-validator'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import env from '../config/env'

export const makeSearchAudiobooksController = (): SearchAudiobooksController => {
  const nullValidator = new NullValidatorAdapter()
  const emptyValidator = new EmptyValidatorAdapter()
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)
  const accessTokenValidator = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const searchAudiobooksValidate = new SearchAudiobooksValidator(nullValidator, env.app.queryLimit, env.app.queryListSeparator)
  const searchAudiobookxParse = new SearchAudiobooksParser(emptyValidator, env.app.queryLimit)
  const searchAudiobooksRepository = new MongoSearchAudiobooksRepository()
  const searchAudiobooks = new DbSearchAudiobooks(searchAudiobooksRepository)

  return new SearchAudiobooksController(
    nullValidator,
    emptyValidator,
    accessTokenValidator,
    searchAudiobooksValidate,
    searchAudiobookxParse,
    searchAudiobooks
  )
}
