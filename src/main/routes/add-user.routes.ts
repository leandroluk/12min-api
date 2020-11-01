import { Router } from 'express'
import jsonRouteAdapter from '../adapters/json-route.adapter'
import env from '../config/env'
import { makeAddUserController } from '../factories/add-user.factory'

export default (router: Router): void => {
  router.post(
    env.routes.addUser,
    jsonRouteAdapter(makeAddUserController())
  )
}
