import { openai } from './openai.js'

export const INITIAL_SESSION = {
    messages: [],
}

export async function initCommand(ctx) {
    ctx.session = { ...INITIAL_SESSION }
    await ctx.reply('I am waiting for your voice or text message.')
}

//! Text to chat
export async function processTextToChat(ctx, content, isVoice = false) {
    try {
        ctx.session.messages.push({ role: openai.roles.USER, content })

        const response = await openai.chat(ctx.session.messages)

        ctx.session.messages.push({
            role: openai.roles.ASSISTANT,
            content: response.content,
        })

        if (isVoice) {
            return response.content
        };

        await ctx.reply(response.content);
    } catch (e) {
        console.log('Error while proccesing text to gpt', e.message);
    }
}