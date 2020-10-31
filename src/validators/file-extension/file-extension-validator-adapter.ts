import path from 'path'
import { IFileExtensionValidator } from '../../presentation/protocols/file-extension-validator'

export class FileExtensionValidatorAdapter implements IFileExtensionValidator {
  readonly matchers: RegExp[]

  constructor(
    ...matchers: RegExp[] | string[]
  ) {
    this.matchers = (matchers as any[]).map((matcher: string | RegExp) => new RegExp(matcher, 'i'))
  }

  async isFileExtension(filePath: any): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        const fileExt = path.extname(filePath).replace('.', '')
        const match = (
          typeof fileExt === 'string' &&
          this.matchers.some(matcher => matcher.test(fileExt))
        )
        resolve(match)
      } catch (error) {
        resolve(false)
      }
    })
  }
}
