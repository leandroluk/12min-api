import { Router } from 'express'
import jsonRouteAdapter from '../../adapters/json-route.adapter'
import env from '../../config/env'
import { makeSearchAudiobooksController } from '../../factories/search-audiobooks.factory'

export default (router: Router): void => {
  router.get(
    env.routes.searchAudiobooks,
    jsonRouteAdapter(makeSearchAudiobooksController())
  )
}
