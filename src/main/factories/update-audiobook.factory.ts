import { DbAddAudiobookStatus } from '../../data/use-cases/db-add-audiobook-status/db-add-audiobook-status'
import { DbGetAudiobook } from '../../data/use-cases/db-get-audiobook/db-get-audiobook'
import { DbUpdateAudiobook } from '../../data/use-cases/db-update-audiobook/db-update-audiobook'
import { JwtTokenAdapter } from '../../infra/cryptography/jwt-token-adapter'
import { MongoAddAudiobookStatusRepository } from '../../infra/db/mongodb/repos/add-audiobook-status/add-audiobook-status.repository'
import { MongoGetAudiobookRepository } from '../../infra/db/mongodb/repos/get-audiobook/get-audiobook.repository'
import { MongoUpdateAudiobookRepository } from '../../infra/db/mongodb/repos/update-audiobook/update-audiobook.repository'
import { UpdateAudiobookController } from '../../presentation/controllers/update-audiobook/update-audiobook.controller'
import { AccessTokenValidatorAdapter } from '../../presentation/validators/access-token/access-token-validator-adapter'
import { ConvertFileValidator } from '../../presentation/validators/convert-file/convert-file.validator'
import { UpdateAudiobookValidator } from '../../presentation/validators/update-audiobook/update-audiobook-validator'
import { EmptyValidatorAdapter } from '../../validators/empty/empty-validator-adapter'
import { FileExistsValidatorAdapter } from '../../validators/file-exists/file-exists-validator-adapter'
import { FileExtensionValidatorAdapter } from '../../validators/file-extension/file-extension-validator-adapter'
import { NullValidatorAdapter } from '../../validators/null/null-validator-adapter'
import env from '../config/env'

export const makeUpdateAudiobookController = (): UpdateAudiobookController => {
  const emptyValidator = new EmptyValidatorAdapter()
  const nullValidator = new NullValidatorAdapter()
  const jwtToken = new JwtTokenAdapter(env.authentication.secret, env.authentication.expiresIn)
  const accessTokenValidator = new AccessTokenValidatorAdapter(nullValidator, jwtToken)
  const updateAudiobookValidate = new UpdateAudiobookValidator(nullValidator)
  const fileExtensionValidator = new FileExtensionValidatorAdapter(...env.converters.fileExtensionMatchers)
  const fileExistsValidator = new FileExistsValidatorAdapter()
  const convertFileValidate = new ConvertFileValidator(nullValidator, fileExtensionValidator, fileExistsValidator)
  const getAudiobookRepository = new MongoGetAudiobookRepository()
  const getAudiobook = new DbGetAudiobook(getAudiobookRepository)
  const updateAudiobookRepository = new MongoUpdateAudiobookRepository()
  const updateAudiobook = new DbUpdateAudiobook(updateAudiobookRepository)
  const addAudiobookStatusRepository = new MongoAddAudiobookStatusRepository()
  const addAudiobookStatus = new DbAddAudiobookStatus(addAudiobookStatusRepository)

  return new UpdateAudiobookController(
    emptyValidator,
    accessTokenValidator,
    updateAudiobookValidate,
    convertFileValidate,
    getAudiobook,
    updateAudiobook,
    addAudiobookStatus
  )
}
