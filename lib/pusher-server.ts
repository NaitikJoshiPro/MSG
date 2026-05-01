// eslint-disable-next-line @typescript-eslint/no-require-imports
const PusherServer = require('pusher') as typeof import('pusher')

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})
