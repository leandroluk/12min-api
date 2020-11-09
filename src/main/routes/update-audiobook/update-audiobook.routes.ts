import { Router } from 'express'
import path from 'path'
import multipartRouteAdapter from '../../adapters/multipart-route.adapter'
import env from '../../config/env'
import { makeUpdateAudiobookController } from '../../factories/update-audiobook.factory'

export default (router: Router): void => {
  router.put(
    env.routes.updateAudiobook,
    multipartRouteAdapter(
      makeUpdateAudiobookController(),
      path.join(env.app.basePath, env.app.tempDir)
    )
  )
}
