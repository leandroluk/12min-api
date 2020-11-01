import { Router } from 'express'
import { adaptJsonRoute } from '../adapters/express-routes.adapter'
import env from '../config/env'
import { makeAuthenticateUserController } from '../factories/authenticate-user.factory'

export default (router: Router): void => {
  router.post(env.routes.authenticateUser, adaptJsonRoute(makeAuthenticateUserController()))
}
