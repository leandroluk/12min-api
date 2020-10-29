export interface IEncrypter {
  encrypt(value: string): Promise<string>
  compare(value: string, hashed: string): Promise<boolean>
}
