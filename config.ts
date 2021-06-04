import * as sensitive from './config.json'
export const Config = {
  ...sensitive,
  admin: '415323805943070721',
  guild: '399688888739692552',
  premium: {
    '617037486719238185': 3, // patron
    '798800694303260703': 3, // super supporter
    '621810419643973642': 1, // booster
    '651523919962177546': 1, // premium
    '623847631566798868': 2, // support team
    '415323805943070721': 10, // staff
    '623847890628116504': 99, // head helper
    '798393980495724564': 1000000 // million servers
  },
  channels: {
    status: '630876009943793694',
    support: '708149822288298138',
    general: '401407031875076098',
    voterLog: '559080414262722571',
    premiumChat: '651520865455833094'
  },
  emojis: {
    offline: '681457517775290554',
    monitoring: '681457749691072568',
    resolved: '681457750714089492'
  },
  voter: [
    ["559081097271443479", 20], // voter
    ["559086971725807636", 50], // real voter
    ["566379442407079965", 100], // frequent voter
    ["746944789005467708", 300], // extreme voter
    ["573994950237093899", 10000000000000] // placeholder
  ]
}
