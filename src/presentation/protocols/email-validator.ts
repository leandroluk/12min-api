export interface IEmailValidator {
  isEmail(value: any): Promise<boolean>
}
