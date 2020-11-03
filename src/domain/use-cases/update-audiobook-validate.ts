import { IUpdateAudiobookModel } from './update-audiobook'

export interface IUpdateAudiobookValidate {
  validateUpdateAudiobook(updateAudiobook: IUpdateAudiobookModel): Promise<any>
}
