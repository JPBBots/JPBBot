import { JPBBot } from './JPBBot'
import MongoCollection from 'mongodb/lib/collection'
import { Snowflake } from 'discord.js'

export class PremiumManager {
  client: JPBBot

  constructor (client: JPBBot) {
    this.client = client
  }

  private get config () {
    return this.client.config
  }

  public get db (): MongoCollection {
    return this.client.db.collection('premium_users', null, null)
  }

  /**
   * Gets amount of premium servers a user has
   * @param id ID of user
   */
  public async amount (id: Snowflake): Promise<number> {
    const member = await this.client.guild.members.fetch(id)
      .catch(() => {})
  
    if (!member) return 0
  
    return member.roles.cache.reduce((a, b) => a + (this.config.premium[b.id] || 0), 0)
  }

  /**
   * Remove user's premium
   * @param id ID of user
   */
  public async remove (id: Snowflake) {
    const current = await this.db.findOne({ id })
  
    if (!current) return console.log('No current')
  
    if (current.guilds.length <= await this.amount(id)) return console.log('Still has enough premium.')
  
    this.db.removeOne({ id })
  
    console.log(`Removing premium servers ${current.guilds} (user: ${id})`)
  
    this.client.users.cache.get(id).send('A premium role was removed and you do not have enough premium servers left. All have been removed.')
  }
}