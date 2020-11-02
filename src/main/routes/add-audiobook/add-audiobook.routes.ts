import { Router } from 'express'
import path from 'path'
import multipartRouteAdapter from '../../adapters/multipart-route.adapter'
import env from '../../config/env'
import { makeAddAudiobookController } from '../../factories/add-audiobook.factory'

export default (router: Router): void => {
  router.post(
    env.routes.addAudiobook,
    multipartRouteAdapter(
      makeAddAudiobookController(),
      path.join(env.app.basePath, env.app.tempDir)
    )
  )
}
