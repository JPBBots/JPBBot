import { JPBBot } from 'client'
import * as  Discord from 'discord.js'

import fetch from 'node-fetch'

export function SetupPremiumEvents (client: JPBBot) {
  const fetchUser = async (id: Discord.Snowflake) => {
    const customer = await fetch('https://censor.bot/api/premium/' + id, {
      method: 'GET'
    }).then(x => x.json())

    return customer.customer as boolean
  }

  const check = async (member: Discord.GuildMember) => {
    const isPremium = await fetchUser(member.user.id)
    if (!isPremium) return

    member.roles.add(client.config.premiumRole)
  }

  client.on('guildMemberAdd', async (member) => {
    check(member)
  })
}