import { Router } from 'express'
import { makeSignInController } from '../../factories/signin/signin'
import { adaptRoute } from '../../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signin', adaptRoute(makeSignInController()))
}
