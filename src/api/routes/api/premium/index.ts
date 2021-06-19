import E from 'express'
import { JPBBot } from 'client'

export default function (this: JPBBot, router: E.Router) {
  router.get('/:id', async (req, res) => {
    res.send(`${await this.premium.amount(req.params.id)}`)
  })
}