import { ISearchAudiobooksQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksValidate } from '../../../domain/use-cases/search-audiobooks-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { INullValidator } from '../../protocols/null-validator'

export class SearchAudiobooksValidator implements ISearchAudiobooksValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly queryLimit: number,
    readonly queryListSeparator: string
  ) { }

  async validateSearchAudiobooks(query: ISearchAudiobooksQuery): Promise<any> {
    const errors = {} as any

    if (!await this.nullValidator.isNull(query.offset)) {
      const offset = parseInt(query.offset)
      if (typeof query.offset !== 'string' || isNaN(offset) || offset < 0) {
        errors.offset = new InvalidParamError('offset', 'must be a number')
      }
    }

    if (!await this.nullValidator.isNull(query.limit)) {
      const limit = parseInt(query.limit)
      if (typeof query.limit !== 'string' || isNaN(limit) || limit < 0 || limit > this.queryLimit) {
        errors.limit = new InvalidParamError('limit', `must be a number between 0 and ${this.queryLimit}`)
      }
    }

    if (!await this.nullValidator.isNull(query.title)) {
      if (typeof query.title !== 'string') {
        errors.title = new InvalidParamError('title', 'must be a string')
      }
    }

    if (!await this.nullValidator.isNull(query.description)) {
      if (typeof query.description !== 'string') {
        errors.description = new InvalidParamError('description', 'must be a string')
      }
    }

    if (!await this.nullValidator.isNull(query.tags)) {
      if (typeof query.tags !== 'string' || !query.tags.split(this.queryListSeparator).length) {
        errors.tags = new InvalidParamError('tags', `must be a list of string's separated by '${this.queryListSeparator}'`)
      }
    }

    return errors
  }
}
