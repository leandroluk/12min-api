import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http.helper'
describe('http helpers', () => {
  describe('badRequest', () => {
    test('should return http response with status 400', () => {
      const sut = badRequest(new Error())
      expect(sut.statusCode).toBe(400)
    })
  })

  describe('unauthorized', () => {
    test('should return http response with status 401', () => {
      const sut = unauthorized(new Error())
      expect(sut.statusCode).toBe(401)
    })
  })

  describe('serverError', () => {
    test('should return http response with status 500', () => {
      const sut = serverError()
      expect(sut.statusCode).toBe(500)
    })
  })

  describe('ok', () => {
    test('should return http response with status 200', () => {
      const sut = ok({})
      expect(sut.statusCode).toBe(200)
    })
  })
})
