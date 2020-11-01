import { Express } from 'express'
import bodyParser from '../middlewares/body-parser'
import contentType from '../middlewares/content-type'
import cors from '../middlewares/cors'
import headerParser from '../middlewares/header-parser'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(headerParser)
}
