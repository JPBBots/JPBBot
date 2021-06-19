import Express from 'express'
import { JPBBot } from 'client'

import Path from 'path'

import { LoadRoutes } from '@jpbberry/load-routes'

import cors from 'cors'

export async function Api (client: JPBBot) {
  const app = Express()

  app.use(Express.json())
  app.use(Express.urlencoded({
    extended: true
  }))

  app.use(cors())

  LoadRoutes(app, Path.resolve(__dirname, './routes'), client)

  await new Promise(resolve => app.listen(6721, () => resolve(true)))
  console.log('Loaded API')
}