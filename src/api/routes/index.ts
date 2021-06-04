import E from 'express'
import { JPBBot } from '../../structs/JPBBot'

import { Webhook } from '@top-gg/sdk'
import { MessageEmbed, GuildMember } from 'discord.js'

export default function (client: JPBBot, router: E.Router) {
  router.get('/admin/:id', async (req, res) => {
    res.send(`${await client.isAdmin(req.params.id) ? 1 : 0}`)
  })
  
  router.get('/premium/:id', async (req, res) => {
    res.send(`${await client.premium.amount(req.params.id)}`)
  })

  const wh = new Webhook(client.config.dblAuth)

  router.post('/dblwebhook', wh.listener(async (vote) => {
    // @ts-ignore
    const member: GuildMember | false = await client.guild.members.fetch(vote.user).catch(() => false)
    console.log(member ? `Vote from ${member.user.tag}` : `Vote from ${vote.user} (not in server)`)
 
    await client.db.collection('voters', null, null).updateOne({ id: vote.user }, {
      $set: {
        id: vote.user
      },
      $inc: {
        amount: 1
      }
    }, { upsert: true }, null)

    if (!member) return
  
    const { amount } = await client.db.collection('voters', null, null).findOne({ id: member.user.id })
  
    const deservedRoles: any = client.config.voter
      .filter(x => x[1] <= amount)
  
    const doesntHave = deservedRoles
      .filter(x => !member.roles.cache.has(x[0]))
  
    const nextRole = client.config.voter[client.config.voter.indexOf(deservedRoles[deservedRoles.length - 1]) + 1]
  
    await member.roles.add(doesntHave.map(x => x[0]), 'Voter rewards')
  
    client.send('voterLog',
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Thanks ${member.user.tag} for voting!`)
        .setDescription(`${amount} total votes!`)
        // @ts-ignore
        .addField('Voted For', `<@${vote.bot}>`, true)
        .addField('Next Role', `<@&${nextRole[0]}> (${Number(nextRole[1]) - amount} more!)`, true)
        .setFooter('Vote for any of the 4 bots to receive role rewards!')
    )
  }))

  router.post('/', (req, res) => {
    console.log(req.body)
  })
}