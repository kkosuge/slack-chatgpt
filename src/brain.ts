import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'

export type Message = {
  role: ChatCompletionRequestMessageRoleEnum
  content: string
}

const systemContent =
  process.env.SYSTEM_MESSAGE ??
  `
  You are a Slack bot.
  You start a conversation triggered by a Mention addressed to you.
  Each conversation message contains an Author ID.
  The Author ID is in the form "<@Author ID> message text
`

const urlMessage =
  process.env.URL_MESSAGE ??
  ` I'm sorry, but as a language model, I do not have access to the internet, so I cannot provide information about URLs. However, if you have any other general questions or concerns, please feel free to ask me. I will do my best to assist you to the best of my abilities.`

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export function createContext(): Message[] {
  return [
    {
      role: 'system',
      content: systemContent,
    },
  ]
}

async function chatGPT(context: Message[], message: string) {
  const messages: Message[] = [
    ...context,
    {
      role: 'user',
      content: message,
    },
  ]

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    return completion.data.choices[0].message!.content
  } catch (e: any) {
    try {
      const code = e.response.data.error.code
      const message = e.response.data.error.message

      if (
        code === 'context_length_exceeded' &&
        process.env.CONTEXT_LENGTH_EXCEEDED_MESSAGE
      ) {
        return process.env.CONTEXT_LENGTH_EXCEEDED_MESSAGE
      }

      if (message) {
        return message
      } else {
        return 'unknown error'
      }
    } catch (e: any) {
      return 'unknown error'
    }
  }
}

export async function chat(context: Message[], message: string) {
  switch (true) {
    case /https?:\/\//.test(message):
      return urlMessage
    default:
      return await chatGPT(context, message)
  }
}
