import Express from 'express'
import { JPBBot } from 'client'

export default function (this: JPBBot, router: Express.Router) {
  router.get('/', (req, res) => {
    res.status(410).json({ message: 'DEPRECATED' })
  })
}