import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from '@discordjs/builders'
import { JPBBot } from '../structs/JPBBot'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

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
      .addUserOption(new SlashCommandUserOption()
        .setName('user')
        .setDescription('User to ping')
        .setRequired(false)
      )
  ]

  constructor(private readonly client: JPBBot) {
    client.on('ready', () => {
      this.client.application.commands.set(this.commands.map(x => x.toJSON()), client.config.guild)
    })

    client.on('interactionCreate', async (int) => {
      if (int.isCommand()) {
        if (int.commandName === 'tag') {
          const tag = int.options.getString('tag', true)
          const user = int.options.getUser('user')

          const foundTag = this.client.tags.get(tag)
          if (!foundTag) return

          const emb = new MessageEmbed(foundTag.embed.toJSON())
            .setFooter('Sent by ' + int.user.tag)

          const msg = await int.channel.send({ embeds: [emb], content: user ? `${user}` : undefined })

          int.reply({
            ephemeral: true,
            content: 'Running tag',
            components: [new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel('Delete')
                  .setStyle('DANGER')
                  .setCustomId(`DELETE_${msg.id}`)
              )]
          })
        }
      } else if (int.isButton() && int.channel.type === 'GUILD_TEXT') {
        if (int.customId.startsWith('DELETE_')) {
          const id = int.customId.split('_')[1]

          int.channel.messages.delete(id)
          int.update({
            content: 'Tag deleted',
            components: []
          })
        }
      } else if (int.isAutocomplete()) {
      }
    })
  }
}