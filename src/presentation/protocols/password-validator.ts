export interface IPasswordValidator {
  isPassword(value: any): Promise<boolean>
}
