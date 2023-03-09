require('dotenv').config()
import { App } from '@slack/bolt'
import type { ChatCompletionRequestMessage } from 'openai'
import { createContext, chat } from './brain'

const waitMessage = process.env.WAIT_MESSAGE ?? 'Please wait a second...'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
})

;(async () => {
  await app.start()
})()

app.event('app_mention', async ({ event, context, client, say }) => {
  const reply = await say({
    text: waitMessage,
    thread_ts: event.ts,
  })

  const text = await chat(createContext(), event.text)

  await client.chat.update({
    channel: event.channel,
    ts: reply.ts!,
    text,
  })
})

app.event('message', async ({ event, context, client, say }) => {
  // @ts-ignore // event.thread_ts is not defined
  const thread_ts = (event.thread_ts as string) || undefined

  if (!thread_ts) return

  const replies = await client.conversations.replies({
    channel: event.channel,
    ts: thread_ts,
    limit: 100,
  })

  // Don't reply if there are no messages
  if (!replies.messages || replies.messages?.length === 0) return

  // Don't reply if the bot is the last message
  if (replies.messages[replies.messages.length - 1].bot_id === context.botId)
    return

  // Don't reply if the bot is not in the thread
  if (
    replies.messages.filter((message) => message.bot_id === context.botId)
      .length === 0
  )
    return

  const threadMessages: ChatCompletionRequestMessage[] = replies.messages.map(
    (message) => {
      if (message.bot_id === context.botId) {
        return {
          role: 'assistant',
          content: message.text!,
        }
      } else {
        return {
          role: 'user',
          content: message.text!,
        }
      }
    }
  )

  const message = replies.messages[replies.messages.length - 1].text!

  const messageContext: ChatCompletionRequestMessage[] = [
    ...createContext(),
    ...threadMessages.filter((_, i) => i !== threadMessages.length - 1),
  ]

  const reply = await say({
    text: waitMessage,
    thread_ts: event.ts,
  })

  const text = await chat(messageContext, message)

  await client.chat.update({
    channel: event.channel,
    ts: reply.ts!,
    text,
  })
})
