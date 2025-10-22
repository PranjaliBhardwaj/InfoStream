const express = require('express');
const router = express.Router();
const multer = require('multer');
const { chatWithAI } = require('../services/bedrockService');
const { textToSpeech } = require('../services/pollyService');
const { speechToText } = require('../services/transcribeService');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/text', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required',
      });
    }

    console.log('Processing chat query:', query);

    const responseText = await chatWithAI(query, context || '');

    let audioUrl = null;

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID !== 'your-aws-access-key') {
      try {
        audioUrl = await textToSpeech(responseText);
      } catch (audioError) {
        console.error('Audio generation failed, continuing without audio:', audioError.message);
      }
    }

    res.json({
      response_text: responseText,
      response_audio_url: audioUrl,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Chat request failed',
      message: error.message,
    });
  }
});

router.post('/voice', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Audio file is required',
      });
    }

    const { context } = req.body;

    console.log('Processing voice input...');

    const transcribedText = await speechToText(req.file.buffer);

    console.log('Transcribed text:', transcribedText);

    const responseText = await chatWithAI(transcribedText, context || '');

    let audioUrl = null;

    try {
      audioUrl = await textToSpeech(responseText);
    } catch (audioError) {
      console.error('Audio generation failed:', audioError.message);
    }

    res.json({
      transcribed_query: transcribedText,
      response_text: responseText,
      response_audio_url: audioUrl,
    });
  } catch (error) {
    console.error('Voice chat error:', error);
    res.status(500).json({
      error: 'Voice chat request failed',
      message: error.message,
    });
  }
});

module.exports = router;
