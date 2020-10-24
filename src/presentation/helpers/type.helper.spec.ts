import { isBoolean, isDate, isInteger, isNull, isNullOrEmpty, isNumber, isObject } from './type.helper'

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

  describe('isNumber', () => {
    test('should return true value is a valid number', () => {
      for (const value of [1, -1, 0, 1.1, -1.1]) {
        expect(isNumber(value)).toBeTruthy()
      }
    })

    test('should return false if value isn\t a number', () => {
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

    test('should return false if isn\'t a valid integer', () => {
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

    test('should return false if isn\'t a valid boolean', () => {
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

    test('should return false if isn\'t a valid date', () => {
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

    test('should return false isn\'t a valid object', () => {
      for (const value of ['', 1, true, null, undefined, function () { }, (f: any) => f]) {
        expect(isObject(value)).toBeFalsy()
      }
    })
  })
})
