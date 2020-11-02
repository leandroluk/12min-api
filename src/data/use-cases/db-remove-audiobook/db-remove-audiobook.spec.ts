import { IRemoveAudiobookRepository } from '../../protocols/remove-audiobook.repository'
import { DbRemoveAudiobook } from './db-remove-audiobook'

const makeRemoveAudiobookRepository = (): IRemoveAudiobookRepository => {
  class RemoveAudiobookRepositoryStub implements IRemoveAudiobookRepository {
    async removeAudiobook(_audiobookId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new RemoveAudiobookRepositoryStub()
}

const makeSut = (): {
  removeAudiobookRepository: IRemoveAudiobookRepository
  sut: DbRemoveAudiobook
} => {
  const removeAudiobookRepository = makeRemoveAudiobookRepository()
  const sut = new DbRemoveAudiobook(removeAudiobookRepository)

  return {
    removeAudiobookRepository,
    sut
  }
}

describe('DbRemoveAudiobook', () => {
  describe('removeAudiobook', () => {
    test('should call RemoveAudiobookRepository with correct values', async () => {
      const { sut, removeAudiobookRepository } = makeSut()
      const removeAudiobookSpy = jest.spyOn(removeAudiobookRepository, 'removeAudiobook')
      await sut.removeAudiobook('audiobookId')
      expect(removeAudiobookSpy).toHaveBeenCalledWith('audiobookId')
    })

    test('should throw if IRemoveAudiobookRepository throws', async () => {
      const { sut, removeAudiobookRepository } = makeSut()
      jest.spyOn(removeAudiobookRepository, 'removeAudiobook').mockRejectedValue(new Error())
      await expect(sut.removeAudiobook('audiobookId')).rejects.toThrow()
    })

    test('should return true if audiobook is removed', async () => {
      const { sut } = makeSut()
      await expect(sut.removeAudiobook('audiobookId')).resolves.toBeTruthy()
    })
  })
})
