import { JPBBot } from './JPBBot'
import * as fs from 'fs'
import { MessageEmbed } from 'discord.js'

import FuzzySearch from 'fuzzy-search'

interface Tag {
  title: string
  embed: MessageEmbed
}

export class TagManager extends FuzzySearch<Tag> {
  client: JPBBot
  tags: Tag[]

  constructor (client: JPBBot) {
    super([], ['title'])

    this.client = client

    const tags = fs.readFileSync(require('path').resolve(__dirname, '../../../tags.tg'), 'utf8')

    this.tags = this._parse(tags)
    this.haystack = this.tags
  }

  private _parse (text: string): Tag[] {
    const separated = text.split('===')
    separated.shift()
    return separated.map(part => {
      const split = part.split('\n')
      const [title, image] = split.shift().split(' ')

      const embed = new MessageEmbed()
        .setDescription(split.join('\n'))
        .setImage(image)

      return { title, embed }
    })
  }

  public get (name: string): Tag|false {
    return this.tags.find(x => x.title === name) || false
  }
}