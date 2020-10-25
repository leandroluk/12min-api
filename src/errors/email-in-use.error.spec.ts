import { EmailInUseError } from './email-in-use.error'

describe('EmailInUseError', () => {
  test('should return email in use error with passed email', () => {
    const sut = new EmailInUseError('foo@bar.com')
    expect(sut.message).toMatch(/Email .* in use/)
    expect(sut.message).toMatch(/foo@bar\.com/)
  })
})
