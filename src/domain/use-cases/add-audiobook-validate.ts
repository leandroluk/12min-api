import { IAddAudiobookModel } from './add-audiobook'

export interface IAddAudiobookValidate {
  validateAddAudiobook(addAudiobook: IAddAudiobookModel): Promise<any>
}
