import { DbAddAudiobookStatus } from '../../data/use-cases/db-add-audiobook-status/db-add-audiobook-status'
import { DbAddAudiobook } from '../../data/use-cases/db-add-audiobook/db-add-audiobook'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoAddAudiobookStatusRepository } from '../../infra/db/mongodb/repos/add-audiobook-status/add-audiobook-status.repository'
import { MongoAddAudiobookRepository } from '../../infra/db/mongodb/repos/add-audiobook/add-audiobook.repository'
import { AddAudiobookController } from '../../presentation/controllers/add-audiobook/add-audiobook.controller'
import { AccessTokenValidatorAdapter } from '../../presentation/validators/access-token/access-token-validator-adapter'
import { AddAudiobookValidator } from '../../presentation/validators/add-audiobook/add-audiobook-validator'
import { ConvertAudioFileValidator } from '../../presentation/validators/convert-file/convert-file.validator'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { FileExistsValidatorAdapter } from '../../validators/file-exists/file-exists-validator-adapter'
import { FileExtensionValidatorAdapter } from '../../validators/file-extension/file-extension-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import env from '../config/env'

export const makeAddAudiobookController = (): AddAudiobookController => {
  const emptyValidator = new EmptyValidatorAdapter()
  const nullValidator = new NullValidatorAdapter()
  const fileExtensionValidator = new FileExtensionValidatorAdapter(...env.converters.fileExtensionMatchers)
  const fileExistsValidator = new FileExistsValidatorAdapter()
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)
  const accessTokenValidator = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const addAudiobookValidate = new AddAudiobookValidator(nullValidator)
  const convertAudioFileValidate = new ConvertAudioFileValidator(nullValidator, fileExtensionValidator, fileExistsValidator)
  const addAudiobookRepository = new MongoAddAudiobookRepository()
  const addAudiobook = new DbAddAudiobook(addAudiobookRepository)
  const addAudiobookStatusRepository = new MongoAddAudiobookStatusRepository()
  const addAudiobookStatus = new DbAddAudiobookStatus(addAudiobookStatusRepository)

  return new AddAudiobookController(
    emptyValidator,
    accessTokenValidator,
    addAudiobookValidate,
    convertAudioFileValidate,
    addAudiobook,
    addAudiobookStatus
  )
}
