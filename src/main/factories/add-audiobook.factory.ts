import { AddAudiobookController } from '../../presentation/controllers/add-audiobook/add-audiobook.controller'

export const makeAddAudiobookController = (): AddAudiobookController => {
  return new AddAudiobookController()
}
