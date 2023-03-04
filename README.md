# Slack ChatGPT
Slack Chatbot with OpenAI's GPT is a conversational chatbot that functions on Slack. This chatbot utilizes OpenAI's ChatGPT API, a state-of-the-art language model, to generate human-like responses during chat-based conversations.

## Functions
- Automatically responds to mentions on Slack.
- Engages in simple conversations with users.
- Uses the OpenAI's GPT-3 API to enable more natural and fluid conversations.
- Has the ability to remember previous conversations with users.

## Required components
- Node.js version 12 or later
- Slack API tokens
- An OpenAI API Key

## Installation and Setup
0. Create a Slack app based on the manifest.yml file and obtain the SLACK_BOT_TOKEN and SLACK_APP_TOKEN. Also, create an OpenAI account and obtain an API Key.

1. Clone this repository.  
$ git clone https://github.com/kkosuge/slack-chatgpt.git

2. Install required libraries.  
$ yarn install

3. Copy the .env.sample file and rename it to .env.  
$ cp .env.sample .env

4. Edit .env file and insert your Slack API token and OpenAI API Key.

5. Run the bot locally.  
$ yarn dev

## Usage
1. Add this chatbot to your Slack channel.
2. In a Slack conversation, type a mention of your chatbot's name: @<bot name>
3. The chatbot will respond and initiate a chat with you.

## License
MIT License
