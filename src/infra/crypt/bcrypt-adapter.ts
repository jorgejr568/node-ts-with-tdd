import { Encrypter } from '../../data/protocols/crypt/encrypter'
import bcrypt from 'bcrypt'
import { HashCompare } from '../../data/protocols/crypt/hash-compare'

export class BcryptAdapter implements Encrypter, HashCompare {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare (data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash)
  }
}
