import { Router } from 'express'
import jsonRouteAdapter from '../adapters/json-route.adapter'
import env from '../config/env'
import { makeRemoveAudiobookController } from '../factories/remove-audiobook.factory'

export default (router: Router): void => {
  router.delete(
    env.routes.removeAudiobook,
    jsonRouteAdapter(makeRemoveAudiobookController())
  )
}
