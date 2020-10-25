export interface INullValidator {
  isNull(value: any): Promise<boolean>
}
