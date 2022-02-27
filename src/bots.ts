export interface Bot {
  name: string
  slug: slugs
  id: string
  description: string
  serverCount?: number
  avatar?: string
  site?: string
  invite: `/${string}` | number
}

export const BOT_SLUGS = ['censorbot', 'easyapps', 'weather', 'frogbot', 'ti84', 'famousbirthdays'] as const
export type slugs = typeof BOT_SLUGS[number]

export const bots: Bot[] = [
  {
    name: 'Censor Bot',
    slug: 'censorbot',
    id: '394019914157129728',
    avatar: 'https://static.jpbbots.org/censorbot.svg',
    description:
      "Advanced Anti-Swear Bot that comes with pre-built filters, no work needed! Discord's most popular anti-swear & bad word blocker.",
    site: 'https://censor.bot',
    invite: '/invite'
  },
  {
    name: 'Easy Applications',
    slug: 'easyapps',
    description:
      'Easy applications is a simple but extremely powerful application tool for allowing your server members to apply within Discord.' +
      'No need to link to google forms all the time, have your applications where you want them, and allow your admins to take care of them.',
    id: '737539715854761994',
    avatar:
      'https://cdn.discordapp.com/avatars/737539715854761994/920f947be6cf92308fc8231eb4b775d1.png',
    site: 'https://easyapps.bot',
    invite: '/invite'
  },
  {
    name: 'Weather',
    slug: 'weather',
    description:
      "Discord's largest Weather information dedicated bot. Get weather status at any area with a simple command. /weather and /forecast",
    id: '523260365950287906',
    avatar:
      'https://cdn.discordapp.com/avatars/523260365950287906/219b490d83595b8374cfeaf76ccbd440.png',
    invite: 537250816
  },
  {
    name: 'Frog Bot',
    slug: 'frogbot',
    description:
      'A frog dedicated to sending frog pictures whenever you just need a bit of frog. Just do /frog',
    id: '814660831472123934',
    avatar:
      'https://cdn.discordapp.com/avatars/814660831472123934/6476b6002842dafd4cd8135baf0aaa63.png',
    invite: 274878286848
  },
  {
    name: 'TI-84',
    slug: 'ti84',
    description:
      'Every high schoolers best friend. The graphing calculator for discord.',
    id: '550823464198471691',
    avatar:
      'https://cdn.discordapp.com/avatars/550823464198471691/d03cb837fd661b65fbfde3a540b43fe5.png?size=128',
    invite: 274878286848
  },
  {
    name: 'Famous Birthdays',
    slug: 'famousbirthdays',
    description: 'Look at famous birthdays that happened on this date!',
    id: '540387160772050954',
    avatar:
      'https://cdn.discordapp.com/avatars/540387160772050954/08fa80037bf2d1bd13c276ad671c0cf4.png',
    invite: 537250816
  }
]

export const processNames: {
  [key in slugs]: string
} = {
  censorbot: 'CensorBot',
  easyapps: 'EasyApplications',
  famousbirthdays: 'FamousBirthdays',
  frogbot: 'FrogBot',
  ti84: 'TI-84',
  weather: 'Weather'
}
