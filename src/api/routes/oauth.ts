import Express from 'express'
import { JPBBot } from '../../structs/JPBBot'

export default function (client: JPBBot, router: Express.Router) {
  router.get('/', (req, res) => {
    res.status(410).json({ message: 'DEPRECATED' })
  })
}