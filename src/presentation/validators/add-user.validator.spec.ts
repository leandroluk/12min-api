import { IAddUserValidateModel } from '@/domain/use-cases/add-user-validate'
import faker from 'faker'
import { AddUserValidator } from './add-user.validator'

const makeUser = (): IAddUserValidateModel => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

describe('AddUserValidator', () => {
  describe('validateUser', () => {
    test('should return a missing param error inner object validation error if some required field isn\t provided', async () => {
      const sut = new AddUserValidator()
      const user = makeUser()
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        const current = { ...user }

        delete current[field]

        const result = await sut.validateAddUser(current)

        expect(result.message).toMatch(/Object validation/)
        expect(result.errors[field].message).toMatch(/Missing param/)
      }
    })

    test('should return a invalid param error inner object validation error if some field is invalid', async () => {
      const sut = new AddUserValidator()
      const user = makeUser()

      const invalidFields = {
        email: [
          '', 1, 1.1, true, function () { }, (f: any) => f,
          'a', 'a@', 'a@a', 'a@a.', 'a@a.c', 'a a@a.com', 'a@.com', 'a@a.com..'
        ],
        password: [
          '', 1, 1.1, true, function () { }, (f: any) => f,
          '12', '0123456789012345678901234567891'
        ]
      }

      for (const [field, values] of Object.entries(invalidFields)) {
        for (const value of values) {
          const current = { ...user }

          current[field] = value

          const result = await sut.validateAddUser(current)

          expect(result.message).toMatch(/Object validation/)
          expect(result.errors[field].message).toMatch(/Invalid param/)
        }
      }
    })
  })
})
