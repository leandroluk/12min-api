export interface ISchemaValidator<T> {
  validate(value: T): Promise<{ [field: string]: Error }>
}
