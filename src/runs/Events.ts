import { JPBBot } from 'client'
import * as  Discord from 'discord.js'

export function SetupEvents (client: JPBBot) {
  // premium
  client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (newMember.roles.cache.has(client.config.premiumRole)) return

    const removedRoles = oldMember
      .roles.cache
      .filter(x => !newMember.roles.cache.has(x.id))
  
    const addedRoles = newMember
      .roles.cache
      .filter(x => !oldMember.roles.cache.has(x.id))
  
    if (addedRoles.some(x => Object.keys(client.config.premium).includes(x.id))) {
      client.send('premiumChat', `${newMember.user} thank you for supporting the bot! Learn how to setup your premium server(s) here: <#651530898012897331>. And if you need any help feel free to ask here!`)
    }
  
    if (!removedRoles.some(x => Object.keys(client.config.premium).includes(x.id))) return
  
    console.log('A premium role removed')
  
    client.premium.remove(newMember.user.id)
  })

  client.on('guildMemberRemove', (member) => {
    if (!member.roles.cache.some(x => Object.keys(client.config.premium).includes(x.id))) return

    if (member.roles.cache.has(client.config.premiumRole)) return
  
    client.premium.remove(member.user.id)
  })

  client.on('guildMemberAdd', (member) => {
    if (member.roles.cache.some(x => Object.keys(client.config.premium).includes(x.id))) {
      setTimeout(() => {
        client.send('premiumChat', `${member.user} thank you for supporting the bot! Learn how to setup your premium server(s) here: <#651530898012897331>. And if you need any help feel free to ask here!`)
      }, 1000)
    }
  })

  client.on('messageCreate', async (msg) => {
    if (['.', ',', '•'].includes(msg.content)) {
      return void msg.delete()
    }

    if (msg.content === 'jpb load') {
      await client.guild.members.fetch()
      msg.reply(':ok_hand:')
    }
  
    if (msg.content.match(/^jpb admin/)) {
      msg.reply(`${await client.isAdmin((msg.mentions.users.first() || {}).id || msg.author.id)}`)
    }
  
    if (msg.content.match(/^jpb premium/)) {
      msg.reply(`${await client.premium.amount((msg.mentions.users.first() || {}).id || msg.author.id)}`)
    }
  
    if (msg.content.match(/^jpb restart/)) {
      if (await client.isAdmin(msg.author.id)) {
        await msg.reply(':ok_hand:')
        process.exit()
      }
    }
  })

  // tags
  interface TagCache {
    [key: string]: Discord.Message
  }
  const tagCache: TagCache = {}

  client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('$')) return
    const tag = message.content.split(/\$| /)[1]
    
    const tagContent = client.tags.get(tag)
    if (!tagContent) return

    const msg = await message.channel.send(tagContent.content)
    tagCache[message.id] = msg

    setTimeout(() => {
      delete tagCache[message.id]
    }, 300000)
  })

  client.on('messageUpdate', async (_, newMessage) => {
    const msg = tagCache[newMessage.id]

    const tag = newMessage.content.split(/\$| /)[1]
    const tagContent = client.tags.get(tag)

    if (!msg) {
      if (!newMessage.content.startsWith('$') || !tagContent) return
      const startMsg = await newMessage.channel.send(tagContent.content)
      tagCache[newMessage.id] = startMsg
      setTimeout(() => {
        delete tagCache[newMessage.id]
      }, 300000)
      return
    }

    if (!newMessage.content.startsWith('$') || !tagContent) {
      msg.delete()
      delete tagCache[newMessage.id]
      return
    }

    msg.edit(tagContent.content)
  })

  client.on('messageDelete', (message) => {
    const current = tagCache[message.id]
    if (!current) return

    current.delete()
    delete tagCache[message.id]
  })
}