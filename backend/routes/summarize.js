const express = require('express');
const router = express.Router();
const { summarizeArticle } = require('../services/bedrockService');
const { scrapeArticle, isUrl } = require('../utils/scraper');

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text or URL is required',
      });
    }

    let articleContent = text;

    if (isUrl(text.trim())) {
      console.log('Detected URL, scraping content...');
      const scraped = await scrapeArticle(text.trim());
      articleContent = `${scraped.title}\n\n${scraped.content}`;
    }

    if (articleContent.length < 100) {
      return res.status(400).json({
        error: 'Content too short for summarization',
      });
    }

    if (articleContent.length > 10000) {
      articleContent = articleContent.substring(0, 10000);
    }

    console.log('Sending to Bedrock for summarization...');
    const result = await summarizeArticle(articleContent);

    res.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({
      error: 'Summarization failed',
      message: error.message,
    });
  }
});

module.exports = router;
