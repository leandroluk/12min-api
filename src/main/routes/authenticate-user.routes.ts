import { Router } from 'express'
import jsonRouteAdapter from '../adapters/json-route.adapter'
import env from '../config/env'
import { makeAuthenticateUserController } from '../factories/authenticate-user.factory'

export default (router: Router): void => {
  router.post(env.routes.authenticateUser, jsonRouteAdapter(makeAuthenticateUserController()))
}
