import fs from 'fs'
import { IAudiobookValidator } from '../presentation/protocols/audiobook-validator'
import { AudiobookValidatorAdapter } from './audiobook-validator-adapter'

const makeSut = (): {
  sut: IAudiobookValidator
  invalidFiles: any[]
  validFiles: any[]
} => {
  const sut = new AudiobookValidatorAdapter()
  const invalidFiles = [
    '', 1, 1.1, true, {}, [], function () { }, (f: any) => f,
    'a', 'asd', 'a/a', 'a\\a', 'a a', 'a a.', 'a\\a.', 'a/a.', 'a/a/a/a', 'a/a/a/a.'
  ]
  const validFiles = [
    'f.mp3', 'f.MP3', 'd/f.mp3', '/d/f.mp3', 'd/d/f.mp3', '/d/d/f.mp3',
    'f.wav', 'f.WAV', 'd/f.wav', '/d/f.wav', 'd/d/f.wav', '/d/d/f.wav'
  ]

  return {
    sut,
    invalidFiles,
    validFiles
  }
}

jest.mock('fs', () => ({
  access(_path: string, callback: (err: Error) => void) {
    callback(null)
  }
}))

describe('AudiobookValidatorAdapter', () => {
  test('should return false if invalid file is provided', async () => {
    const { sut, invalidFiles } = makeSut()
    for (const value of invalidFiles) {
      await expect(sut.isAudiobook(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if valid file is provided', async () => {
    const { sut, validFiles } = makeSut()
    jest.spyOn(fs, 'access').mockImplementation((_path, callback: (err: Error) => void) => {
      callback(null)
    })
    for (const value of validFiles) {
      await expect(sut.isAudiobook(value)).resolves.toBeTruthy()
    }
  })

  test('should fs.access is called', async () => {
    const { sut } = makeSut()
    const accessSpy = jest.spyOn(fs, 'access')
    await sut.isAudiobook('f.mp3')
    expect(accessSpy).toHaveBeenCalled()
  })

  test('should return false if fs.access return error', async () => {
    const { sut } = makeSut()

    jest.spyOn(fs, 'access').mockImplementation((path: fs.PathLike, cb: fs.NoParamCallback) => {
      cb(new Error())
    })

    await expect(sut.isAudiobook('f.mp3')).resolves.toBeFalsy()
  })
})
