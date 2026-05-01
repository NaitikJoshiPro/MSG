const hasPusher =
  process.env.PUSHER_APP_ID &&
  process.env.PUSHER_KEY &&
  process.env.PUSHER_SECRET &&
  process.env.PUSHER_CLUSTER

let _pusherServer: import('pusher') | null = null

if (hasPusher) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PusherServer = require('pusher') as typeof import('pusher')
  _pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  })
}

export const pusherServer = _pusherServer
