const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function summarizeArticle(text) {
  const prompt = `You are an expert content analyzer for video creation. Analyze the following article and:

1. Create a concise summary (2-3 sentences)
2. Extract 5-6 key visual scenes that would work well in a short video
3. Each scene should be visually descriptive and suitable for video generation
4. Assign appropriate duration for each scene (6-12 seconds)

Article:
${text}

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief article summary here",
  "scenes": [
    {
      "scene_text": "Visual description of scene 1",
      "duration": 8
    }
  ]
}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  };

  try {
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    const content = responseBody.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format from Bedrock');
  } catch (error) {
    console.error('Bedrock summarization error:', error);
    throw error;
  }
}

async function chatWithAI(query, context = '') {
  const prompt = `You are InfoStream Companion, a friendly AI assistant that helps users understand complex topics from news articles.

User's question: ${query}
${context ? `Context: ${context}` : ''}

Provide a clear, simple explanation that:
- Uses everyday language and analogies
- Breaks down complex concepts
- Is conversational and engaging
- Stays focused and concise (2-4 sentences)

Response:`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
  };

  try {
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.content[0].text.trim();
  } catch (error) {
    console.error('Bedrock chat error:', error);
    throw error;
  }
}

module.exports = {
  summarizeArticle,
  chatWithAI,
};
