import axios from "axios";
import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createReadStream } from 'fs';
import { removeFile } from "./utils.js";
import config from 'config'

const VOICE_ID = 'pNInz6obpgDQGcFmaJgB';
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

export async function textToSpeech(ctx, text = "Default Message") {
    const headers = {
        'Content-Type': 'application/json',
        'accept': 'audio/mpeg',
        'xi-api-key': config.get('ELEVANAI_KEY'),
    };

    const requestData = {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
        },
    };

    const response = await axios.post(API_URL, requestData, { headers, responseType: 'arraybuffer' });
    try {
        writeFileSync('voices/output.mp3', response.data);
        processSpeechToChat(ctx);
    } catch (e) {
        console.log('Error while converting text to voice ', e.message);
    }

}

export async function processSpeechToChat(ctx) {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const voicePath = resolve(__dirname, '../voices/output.mp3')
    const audioStream = createReadStream(voicePath);
    await ctx.replyWithAudio({ source: audioStream }, { title: 'Your Bro', performer: 'Mutasim 🤓' })

    removeFile(voicePath);
}


