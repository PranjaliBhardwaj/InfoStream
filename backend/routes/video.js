const express = require('express');
const router = express.Router();
const { generateVideo, generateMockVideo } = require('../services/videoGenerator');

router.post('/', async (req, res) => {
  try {
    const { scenes } = req.body;

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        error: 'Scenes array is required',
      });
    }

    for (const scene of scenes) {
      if (!scene.scene_text || typeof scene.scene_text !== 'string') {
        return res.status(400).json({
          error: 'Each scene must have a scene_text property',
        });
      }
    }

    console.log(`Generating video with ${scenes.length} scenes...`);

    let videoUrl;

    if (process.env.JSON2VIDEO_API_KEY && process.env.JSON2VIDEO_API_KEY !== 'your-json2video-api-key') {
      videoUrl = await generateVideo(scenes);
    } else {
      console.log('Using mock video generation (JSON2VIDEO_API_KEY not configured)');
      videoUrl = await generateMockVideo(scenes);
    }

    res.json({
      video_url: videoUrl,
      scenes_count: scenes.length,
      status: 'completed',
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({
      error: 'Video generation failed',
      message: error.message,
    });
  }
});

module.exports = router;
