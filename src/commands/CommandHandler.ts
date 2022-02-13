import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'
import { JPBBot } from '../structs/JPBBot'

export class CommandHandler {
  commands = [
    new SlashCommandBuilder()
      .setName('tag')
      .setDescription('Run a tag')
      .addStringOption(new SlashCommandStringOption()
        .setName('tag')
        .setDescription('Tag to run')
        .setRequired(true)
        .addChoices(this.client.tags.tags.map(x => ([
          x.title,
          x.title
        ])))
      )
  ]

  constructor (private readonly client: JPBBot) {
    console.log(this.commands[0].toJSON())
    client.on('ready', () => {
      this.client.application.commands.set(this.commands.map(x => x.toJSON()), client.config.guild)
    })

    client.on('interactionCreate', (int) => {
      if (int.isCommand()) {
        if (int.commandName === 'tag') {
          const tag = int.options.getString('tag', true)

          const foundTag = this.client.tags.get(tag)
          if (!foundTag) return

          int.channel.send(foundTag.content)

          int.reply({
            ephemeral: true,
            content: 'Running tag'
          })
        }
      }
    })
  }
}