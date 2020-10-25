import {
  isBoolean,
  isDate,
  isEmail,
  isInteger,
  isNull,
  isNullOrEmpty,
  isNumber,
  isObject,
  isString
} from './type.helper'

describe('type.helper', () => {
  describe('isNull', () => {
    test('should return true if is an empty string, undefined or null', () => {
      for (const value of [undefined, null]) {
        expect(isNull(value)).toBeTruthy()
      }
    })

    test('should return false if isn\'t empty', () => {
      for (const value of ['', 1, true, false, {}, [], function () { }, (f: any) => f]) {
        expect(isNull(value)).toBeFalsy()
      }
    })
  })

  describe('isNullOrEmpty', () => {
    test('should return true if is an empty string, undefined or null', () => {
      for (const value of [undefined, null, '']) {
        expect(isNullOrEmpty(value)).toBeTruthy()
      }
    })

    test('should return false if isn\'t empty', () => {
      for (const value of ['1', 1, true, false, {}, [], function () { }, (f: any) => f]) {
        expect(isNullOrEmpty(value)).toBeFalsy()
      }
    })
  })

  describe('isString', () => {
    test('should return true value is a valid string', () => {
      for (const value of ['', '123', ' ']) {
        expect(isString(value)).toBeTruthy()
      }
    })

    test('should return false if invalid string is provided', () => {
      for (const value of [undefined, null, 1, true, {}, [], function () { }, (f: any) => f]) {
        expect(isString(value)).toBeFalsy()
      }
    })
  })

  describe('isNumber', () => {
    test('should return true value is a valid number', () => {
      for (const value of [1, -1, 0, 1.1, -1.1]) {
        expect(isNumber(value)).toBeTruthy()
      }
    })

    test('should return false if invalid number is provided', () => {
      for (const value of ['1', true, {}, [], function () { }, (f: any) => f]) {
        expect(isNumber(value)).toBeFalsy()
      }
    })
  })

  describe('isInteger', () => {
    test('should return true if is valid integer', () => {
      for (const value of [-1, 0, 1]) {
        expect(isInteger(value)).toBeTruthy()
      }
    })

    test('should return false if invalid integer is provided', () => {
      for (const value of [-1.1, 1.1, true, false, {}, [], function () { }, (f: any) => f]) {
        expect(isInteger(value)).toBeFalsy()
      }
    })
  })

  describe('isBoolean', () => {
    test('should return true if is valid boolean', () => {
      for (const value of [true, false]) {
        expect(isBoolean(value)).toBeTruthy()
      }
    })

    test('should return false if invalid boolean is provided', () => {
      for (const value of [1, 1.1, '', {}, [], function () { }, (f: any) => f]) {
        expect(isBoolean(value)).toBeFalsy()
      }
    })
  })

  describe('isDate', () => {
    test('should return true if is valid date', () => {
      for (const value of [new Date(), -2208988800000, Date.now(), '1900-01-01']) {
        expect(isDate(value)).toBeTruthy()
      }
    })

    test('should return false if invalid date is provided', () => {
      for (const value of [true, false, null, '', 'asd']) {
        expect(isDate(value)).toBeFalsy()
      }
    })
  })

  describe('isObject', () => {
    test('should return true if is valid object', () => {
      for (const value of [{}, []]) {
        expect(isObject(value)).toBeTruthy()
      }
    })

    test('should return false invalid object is provided', () => {
      for (const value of ['', 1, true, null, undefined, function () { }, (f: any) => f]) {
        expect(isObject(value)).toBeFalsy()
      }
    })
  })

  describe('isEmail', () => {
    test('should return true if a valid email is provided', () => {
      for (const value of ['a@a.com', 'foo@bar.com', 'a@a.com.br']) {
        expect(isEmail(value)).toBeTruthy()
      }
    })

    test('should return false if invalid email is provided', () => {
      for (const value of [
        '', 1, true, {}, [], function () { }, (f: any) => f,
        'a', 'a@', 'a@a', 'a@a.c', 'a a@a.com', 'a@a.123'
      ]) {
        expect(isEmail(value)).toBeFalsy()
      }
    })
  })
})
