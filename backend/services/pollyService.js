const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require('@aws-sdk/client-polly');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const client = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function textToSpeech(text) {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna',
    Engine: 'neural',
    LanguageCode: 'en-US',
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const response = await client.send(command);

    const audioFileName = `response-${uuidv4()}.mp3`;
    const audioFilePath = path.join(__dirname, '../public/audio', audioFileName);

    const audioStream = response.AudioStream;
    const chunks = [];

    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);
    fs.writeFileSync(audioFilePath, audioBuffer);

    const audioUrl = `/audio/${audioFileName}`;

    return audioUrl;
  } catch (error) {
    console.error('Polly text-to-speech error:', error);
    throw error;
  }
}

module.exports = {
  textToSpeech,
};
