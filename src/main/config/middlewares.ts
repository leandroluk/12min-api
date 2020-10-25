import { bodyParser } from '@/main/middlewares/body-parser'
import { Express } from 'express'

export default (app: Express): void => {
  app.use(bodyParser)
}
