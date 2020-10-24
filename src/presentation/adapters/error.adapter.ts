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

  fromJSON(data: any): Error {
    if (typeof data !== 'object' || !data?.name) {
      throw new TypeError('cannot transform "data" into valid error type')
    }

    const wrapper = {
      [data.name]: class extends Error {
        constructor(...args: any[]) {
          super(...args)
          this.name = data.name
        }
      }
    }

    this.data = new wrapper[data.name]()

    Object
      .entries(data)
      .forEach(([key, value]) => this.data[key] = value)

    return this.data as Error
  }
}
