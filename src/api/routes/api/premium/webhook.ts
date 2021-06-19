import E from 'express'
import { JPBBot } from 'client'
import { Snowflake } from 'discord.js'

export default function (this: JPBBot, router: E.Router) {
  router.use((req, res, next) => {
    if (req.headers.authorization !== process.env.JPBBOT_PREMIUM_UPDATES) return res.sendStatus(403)

    return next()
  })

  router.post<{}, { id: Snowflake }>('/add', (req, res) => {
    res.sendStatus(204)
    const member = this.guild.members.cache.get(req.body.id)
    console.log(member)
    if (!member) return

    member.roles.add(this.config.premiumRole)
  })

  router.post<{}, { id: Snowflake }>('/remove', (req, res) => {
    res.sendStatus(204)
    const member = this.guild.members.cache.get(req.body.id)
    if (!member) return

    member.roles.remove(this.config.premiumRole)
  })
}