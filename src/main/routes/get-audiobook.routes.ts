import { Router } from 'express'
import jsonRouteAdapter from '../adapters/json-route.adapter'
import env from '../config/env'
import { makeGetAudiobookController } from '../factories/get-audiobook.factory'

export default (router: Router): void => {
  router.get(
    env.routes.getAudiobook,
    jsonRouteAdapter(makeGetAudiobookController())
  )
}
