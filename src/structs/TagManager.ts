import { JPBBot } from './JPBBot'
import * as fs from 'fs'

interface Tag {
  title: string
  content: any
}

export class TagManager {
  client: JPBBot
  tags: Tag[]

  constructor (client: JPBBot) {
    this.client = client

    const tags = fs.readFileSync(require('path').resolve(__dirname, '../../../tags.tg'), 'utf8')

    this.tags = this._parse(tags)
  }

  private _parse (text): Tag[] {
    const separated = text.split('===')
    separated.shift()
    return separated.map(part => {
      const split = part.split('\n')
      const [title, image] = split.shift().split(' ')
      return { title, content: { 
        content: '', 
        embed: { description: split.join('\n'), image: { url: image } 
      } } }
    })
  }

  public get (name: string): Tag|false {
    return this.tags.find(x => x.title === name) || false
  }
}