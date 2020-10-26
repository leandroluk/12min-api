import { Router } from 'express'
import { adaptJsonRoute } from '../adapters/express-routes.adapter'
import { makeAddUserController } from '../factories/add-user.factory'

export default (router: Router): void => {
  router.post('/user', adaptJsonRoute(makeAddUserController()))
}
