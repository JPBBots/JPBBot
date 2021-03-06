import * as Discord from 'discord.js'
import MongoDb from 'mongodb/lib/db'
import { Config } from '../../config'
import db from '/home/jpb/db'
const cbConfig = require('dotenv').parse(require('fs').readFileSync('/home/jpb/bots/censorbot/censorbot.env'))

import { SetupEvents } from '../runs/Events'
import { Api } from '../api/Api'

import { PremiumManager } from './PremiumManager'
import { TagManager } from './TagManager'

export class JPBBot extends Discord.Client {
  config: typeof Config
  db: MongoDb
  guild: Discord.Guild

  premium = new PremiumManager(this)
  tags = new TagManager(this)

  constructor () {
    super()

    this.config = Config

    this.setup()
  }

  private async setup () {
    this.db = await db(cbConfig.DB_USERNAME, cbConfig.DB_PASSWORD, 'censorbot')

    await this.login(this.config.token)

    this.guild = this.guilds.cache.get(this.config.guild)

    await this.guild.members.fetch()

    SetupEvents(this)
    await Api(this)

    console.log(`Started (${this.guild.members.cache.size})`)
  }

  /**
   * Send message
   * @param name Name of channel
   * @param content Content
   */
  public async send (name, ...content): Promise<Discord.Message> {
    const channel: any = this.channels.cache.get(this.config.channels[name])
    return channel.send(...content)
  }

  /**
   * Is an admin or not
   * @param id ID of user
   */
  public async isAdmin (id: Snowflake) {
    const member = await this.guild.members.fetch(id)
      .catch(() => {})
  
    if (!member) return false
  
    return member.roles.cache.has(this.config.admin)
  }
}