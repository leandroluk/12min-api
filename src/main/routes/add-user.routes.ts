import { Router } from 'express'
import { adaptJsonRoute } from '../adapters/express-routes.adapter'
import env from '../config/env'
import { makeAddUserController } from '../factories/add-user.factory'

export default (router: Router): void => {
  router.post(env.routes.addUser, adaptJsonRoute(makeAddUserController()))
}
