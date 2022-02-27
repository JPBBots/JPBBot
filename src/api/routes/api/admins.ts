import { JPBBot } from 'client'
import { Snowflake } from 'discord.js'

import E from 'express'

interface AdminUser {
  id: Snowflake
  tag: string
  rank: string
  rankColor: number
  since?: string
  name: string
  avatar: string
}

export default function (this: JPBBot, router: E.Router) {
  router.get('/:id', async (req, res) => {
    res.send(`${(await this.isAdmin(req.params.id)) ? 1 : 0}`)
  })

  router.get('/', (req, res) => {
    const members: AdminUser[] = []

    this.adminRoles.forEach((role) => {
      role.members.forEach((mem) => {
        if (members.some((x) => x.id === mem.id)) return

        members.push({
          id: mem.id,
          tag: mem.user.tag,
          rankColor: role.color,
          name: mem.nickname ?? mem.user.username,
          since: this.config.adminJoined[mem.id],
          avatar: mem.displayAvatarURL({ dynamic: true }),
          rank: this.config.adminRoles.find((x) => x.id === role.id).name
        })
      })
    })

    res.json(members)
  })
}
