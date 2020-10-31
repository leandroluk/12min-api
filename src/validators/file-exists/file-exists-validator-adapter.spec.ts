import fs from 'fs'
import { FileExistsValidatorAdapter } from './file-exists-validator-adapter'


describe('FileExistsValidatorAdapter', () => {
  test('should return false if value is invalid', async () => {
    const sut = new FileExistsValidatorAdapter()
    const invalid = [
      1, 1.1, true, {}, [], function () { }, (f: any) => f
    ]
    for (const value of invalid) {
      await expect(sut.fileExists(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if value is valid', async () => {
    const sut = new FileExistsValidatorAdapter()
    const valid = [
      'a.ext', '/a.ext', '/a/a.EXT', 'a.EXT', '/a.EXT', '/a/a.EXT'
    ]
    jest.spyOn(fs, 'accessSync').mockReturnValue(undefined)
    for (const value of valid) {
      await expect(sut.fileExists(value)).resolves.toBeTruthy()
    }
  })

  test('should return true if this file is accessible', async () => {
    const sut = new FileExistsValidatorAdapter()
    await expect(sut.fileExists(__filename)).resolves.toBeTruthy()
  })

  test('should return false if accessSync throws', async () => {
    const sut = new FileExistsValidatorAdapter()
    jest.spyOn(fs, 'accessSync').mockImplementationOnce(() => { throw new Error() })
    const result = await sut.fileExists('/path/to/file.mp3')
    expect(result).toBeFalsy()
  })
})

