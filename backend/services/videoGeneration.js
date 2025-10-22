const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function generateVideo(scenes) {
  const apiKey = process.env.JSON2VIDEO_API_KEY;

  if (!apiKey) {
    throw new Error('JSON2VIDEO_API_KEY not configured');
  }

  const movieScript = {
    resolution: 'hd1080',
    quality: 'high',
    draft: false,
    scenes: scenes.map((scene, index) => ({
      comment: `Scene ${index + 1}`,
      duration: scene.duration || 8,
      elements: [
        {
          type: 'text',
          text: scene.scene_text,
          style: 'modern',
          font: 'Montserrat',
          fontSize: 48,
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          position: 'center',
          animation: 'fade-in',
        }
      ],
      backgroundColor: '#1a1a2e',
    })),
  };

  try {
    const createResponse = await axios.post(
      'https://api.json2video.com/v2/movies',
      movieScript,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const projectId = createResponse.data.project;
    const movieId = createResponse.data.movie;

    let status = 'rendering';
    let attempts = 0;
    const maxAttempts = 60;

    while (status === 'rendering' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await axios.get(
        `https://api.json2video.com/v2/movies/${projectId}/${movieId}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        }
      );

      status = statusResponse.data.status;

      if (status === 'done') {
        const videoUrl = statusResponse.data.url;
        return videoUrl;
      } else if (status === 'error') {
        throw new Error('Video generation failed');
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Video generation timeout');
    }
  } catch (error) {
    console.error('JSON2Video generation error:', error.response?.data || error.message);
    throw error;
  }
}

async function generateMockVideo(scenes) {
  console.log('Mock video generation for:', scenes.length, 'scenes');

  const videoFileName = `video-${uuidv4()}.mp4`;
  const videoFilePath = path.join(__dirname, '../public/videos', videoFileName);

  fs.writeFileSync(videoFilePath, 'MOCK_VIDEO_DATA');

  return `/videos/${videoFileName}`;
}

module.exports = {
  generateVideo,
  generateMockVideo,
};
