import { FileExtensionValidatorAdapter } from './file-extension-validator-adapter'

describe('FileExtensionValidatorAdapter', () => {
  test('should return false if is not a expected extension', async () => {
    const sut = new FileExtensionValidatorAdapter()
    const invalid = [
      '', 1, 1.1, true, {}, [], function () { }, (f: any) => f,
      '.', 'a.', '/a', '/a.', '/a/a', '/a/a.', '.a', 'a.a', '/a.a', '/a/a.a'
    ]

    for (const value of invalid) {
      await expect(sut.isFileExtension(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if is a expected extension', async () => {
    const sut = new FileExtensionValidatorAdapter('.ext')
    const valid = [
      'a.ext', '/a.ext', '/a/a.EXT',
      'a.EXT', '/a.EXT', '/a/a.EXT'
    ]
    for (const value of valid) {
      await expect(sut.isFileExtension(value)).resolves.toBeTruthy()
    }
  })
})

