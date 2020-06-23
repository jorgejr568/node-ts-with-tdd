import { Encrypter } from '../../../data/protocols/crypt/encrypter'
import { BcryptAdapter } from '../../../infra/crypt/bcrypt-adapter'
import { HashCompare } from '../../../data/protocols/crypt/hash-compare'

const SALT = parseInt(process.env.HASH_SALT) || 12
export const makeHashEncrypter = (): Encrypter => new BcryptAdapter(SALT)
export const makeHashCompare = (): HashCompare => new BcryptAdapter(SALT)
