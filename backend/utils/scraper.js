const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeArticle(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    $('script, style, nav, header, footer, aside, iframe').remove();

    let title = $('h1').first().text().trim();
    if (!title) {
      title = $('title').text().trim();
    }

    const paragraphs = [];
    $('article p, .article-body p, .post-content p, .entry-content p, main p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 50) {
        paragraphs.push(text);
      }
    });

    if (paragraphs.length === 0) {
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          paragraphs.push(text);
        }
      });
    }

    const content = paragraphs.join('\n\n');

    if (content.length < 200) {
      throw new Error('Insufficient content extracted from URL');
    }

    return {
      title,
      content,
      url,
    };
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw new Error(`Failed to scrape article: ${error.message}`);
  }
}

function isUrl(text) {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = {
  scrapeArticle,
  isUrl,
};
