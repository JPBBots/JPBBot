import { JPBBot } from 'client'
import E from 'express'

import { Bot, bots, BOT_SLUGS, slugs } from '../../../bots'

import { FieldType, InfluxDB } from 'influx'

export default function (this: JPBBot, router: E.Router) {
  const influx = new InfluxDB({
    host: 'localhost',
    database: 'stats',
    schema: [
      {
        measurement: 'stats',
        fields: {
          memory: FieldType.INTEGER,
          servers: FieldType.INTEGER,
          ping: FieldType.INTEGER,
          uptime: FieldType.INTEGER,
          name: FieldType.STRING
        },
        tags: []
      }
    ]
  })

  let cached: typeof bots | null = null

  const getBot = async (bot: slugs): Promise<Bot> => {
    const q = await influx.query(`SELECT last("servers") FROM "stats" WHERE ("name" =~ /^${bot}$/)`)

    return {
      ...bots.find(x => x.slug === bot),
      serverCount: (q[0] as any).last as number
    }
  }

  const getBots = async () => {
    if (cached) return cached

    const resp: Bot[] = []
    for (const bot of BOT_SLUGS) {
      resp.push(await getBot(bot))
    }

    cached = resp
    setTimeout(() => {
      cached = null
    }, 900000)

    return resp
  }

  router.get('/', async (req, res) => {
    res.json(await getBots())
  })

  router.get('/:bot', async (req, res) => {
    if (!BOT_SLUGS.includes(req.params.bot as slugs)) return res.status(404).json({
      error: 'Invalid bot slug'
    })

    const bots = await getBots()

    res.json(bots.find(x => x.slug === req.params.bot as slugs))
  })
}

