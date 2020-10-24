
export function isNull(value: any): boolean {
  return [undefined, null].includes(value)
}

export function isNullOrEmpty(value: any): boolean {
  return [undefined, null, ''].includes(value)
}

export function isNumber(value: any): boolean {
  return typeof value === 'number'
}

export function isInteger(value: any): boolean {
  return parseInt(value) === value
}

export function isBoolean(value: any): boolean {
  return [true, false].includes(value)
}

export function isDate(value: any): boolean {
  return (
    !isBoolean(value) &&
    !isNullOrEmpty(value) &&
    !/Invalid Date/.test(new Date(value) as any)
  )
}

export function isObject(value: any): boolean {
  return (
    !isNull(value) &&
    typeof value === 'object'
  )
}
