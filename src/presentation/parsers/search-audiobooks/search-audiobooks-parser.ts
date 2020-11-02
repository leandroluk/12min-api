import { ISearchAudiobooksQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksParse, ISearchAudiobooksParsedQuery } from '../../../domain/use-cases/search-audiobooks-parse'
import { IEmptyValidator } from '../../protocols/empty-validator'

export class SearchAudiobooksParser implements ISearchAudiobooksParse {
  constructor(
    readonly emptyValidator: IEmptyValidator,
    readonly defaultLimit: number
  ) { }

  async parseSearchAudiobooks(searchAudiobooks: ISearchAudiobooksQuery): Promise<ISearchAudiobooksParsedQuery> {
    const parsed = {
      offset: 0,
      limit: this.defaultLimit,
      title: '',
      description: '',
      tags: []
    }

    const [emptyOffset, emptyLimit, emptyTitle, emptyDescription, emptyTags] = await Promise.all([
      this.emptyValidator.isEmpty(searchAudiobooks.offset),
      this.emptyValidator.isEmpty(searchAudiobooks.limit),
      this.emptyValidator.isEmpty(searchAudiobooks.title),
      this.emptyValidator.isEmpty(searchAudiobooks.description),
      this.emptyValidator.isEmpty(searchAudiobooks.tags)
    ])

    if (!emptyOffset) {
      const offset = parseInt(searchAudiobooks.offset)
      if (!isNaN(offset) && offset > 0) {
        parsed.offset = offset
      }
    }

    if (!emptyLimit) {
      const limit = parseInt(searchAudiobooks.limit)
      if (!isNaN(limit) && limit > 0 && limit <= 50) {
        parsed.limit = limit
      }
    }

    if (!emptyTitle) {
      parsed.title = searchAudiobooks.title
    }

    if (!emptyDescription) {
      parsed.description = searchAudiobooks.description
    }

    if (!emptyTags) {
      const tags = (searchAudiobooks.tags || '').split(',')
      if (tags.length > 0) {
        parsed.tags = [...new Set(tags.map(tag => tag.trim()))]
      }
    }

    return parsed
  }
}
