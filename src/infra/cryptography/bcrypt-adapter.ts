import bcrypt from 'bcrypt'
import { IEncrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements IEncrypter {
  constructor(
    readonly salt: number
  ) { }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return await Promise.resolve(hash)
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(value, hashed)
  }
}
