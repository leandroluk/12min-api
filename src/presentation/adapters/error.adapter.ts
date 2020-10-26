export class ErrorAdapter {
  constructor(
    public data: { name: string } | Error
  ) { }

  private transform(value: any): any {
    return value && typeof value === 'object'
      ? Object
        .getOwnPropertyNames(value)
        .filter(key => value instanceof Error ? key !== 'stack' : true)
        .reduce((obj, key) => ({ ...obj, [key]: this.transform(value[key]) }), {})
      : value
  }

  toJSON(): any {
    return this.transform(this.data)
  }
}
