const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface SummarizeResponse {
  summary: string;
  scenes: Array<{
    scene_text: string;
    duration: number;
  }>;
}

interface VideoResponse {
  video_url: string;
  scenes_count: number;
  status: string;
}

interface ChatResponse {
  response_text: string;
  response_audio_url: string | null;
}

interface VoiceChatResponse extends ChatResponse {
  transcribed_query: string;
}

export async function summarizeArticle(text: string): Promise<SummarizeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Summarization failed');
  }

  return response.json();
}

export async function generateVideo(scenes: Array<{ scene_text: string; duration: number }>): Promise<VideoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scenes }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Video generation failed');
  }

  return response.json();
}

export async function chatWithAI(query: string, context?: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, context }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Chat request failed');
  }

  return response.json();
}

export async function voiceChatWithAI(audioBlob: Blob, context?: string): Promise<VoiceChatResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.mp3');
  if (context) {
    formData.append('context', context);
  }

  const response = await fetch(`${API_BASE_URL}/api/chat/voice`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Voice chat request failed');
  }

  return response.json();
}

export function getMediaUrl(path: string): string {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}
