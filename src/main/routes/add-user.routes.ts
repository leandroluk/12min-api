import { Router } from 'express'

export default (router: Router): void => {
  router.post('/user', (_, res) => {
    res.json({ ok: 'ok' })
  })
}
