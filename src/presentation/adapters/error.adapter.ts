export class ErrorAdapter {
  constructor(
    public data: { name: string } | Error
  ) { }

  private transform(value: any): any {
    return typeof value !== 'object' ? value : Object
      .getOwnPropertyNames(value)
      .filter(key => value instanceof Error ? key !== 'stack' : true)
      .reduce((obj, key) => ({ ...obj, [key]: this.transform(value[key]) }), {})
  }

  toJSON(): any {
    return this.transform(this.data)
  }
}
