import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Share2, CheckCircle, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Scene3D } from '../components/Scene3D';
import { ParticleField } from '../components/ParticleField';
import { chatWithAI } from '../services/api';

interface ResultPageProps {
  onRegenerate: () => void;
  onNewVideo: () => void;
  videoUrl: string;
  summary: any;
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export function ResultPage({ onRegenerate, onNewVideo, videoUrl, summary }: ResultPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const context = `Video summary: ${summary.summary}\nScenes: ${JSON.stringify(summary.scenes)}`;
      const response = await chatWithAI(userMessage, context);

      setMessages(prev => [...prev, { role: 'bot', content: response.response_text }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'infostream-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-12">
      <Scene3D>
        <ParticleField />
      </Scene3D>

      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Video Generated Successfully</span>
          </motion.div>

          <h2 className="text-5xl font-bold mb-4 glow-text">Your Video is Ready</h2>
          <p className="text-gray-400 text-lg">
            Preview your animated video explainer below
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass p-4 rounded-3xl glow mb-6">
              <div className="relative aspect-video bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-2xl overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-contain"
                  src={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 border-2 border-violet-500/20 rounded-2xl pointer-events-none" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>

              <motion.button
                onClick={onRegenerate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 glass rounded-xl font-semibold hover:glow transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 glass rounded-xl font-semibold hover:glow transition-all text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-3xl glow h-full flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-violet-400" />
                  <h3 className="font-semibold text-lg">Video Assistant</h3>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 glass rounded-full"
                >
                  {showChat ? 'Hide' : 'Show'}
                </button>
              </div>

              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-400 text-sm py-8">
                          <p className="mb-4">Ask me about your video!</p>
                          <div className="space-y-2">
                            <p className="text-xs text-violet-400 font-semibold">Try asking:</p>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => setInput('Summarize the key points')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                Summarize the key points
                              </button>
                              <button
                                onClick={() => setInput('What are the main topics?')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                What are the main topics?
                              </button>
                              <button
                                onClick={() => setInput('Explain this in simple terms')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                Explain in simple terms
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                msg.role === 'user'
                                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
                                  : 'glass text-gray-200'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="glass px-4 py-2 rounded-2xl">
                            <p className="text-sm text-gray-400">Thinking...</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your question..."
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm disabled:opacity-50"
                        />
                        <motion.button
                          onClick={handleSendMessage}
                          disabled={isLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showChat && (
                <div className="p-6 text-center">
                  <button
                    onClick={() => setShowChat(true)}
                    className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    Click to ask questions about your video
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <button
            onClick={onNewVideo}
            className="text-gray-400 hover:text-white transition-colors underline"
          >
            Create Another Video
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-violet-400 mb-2">HD Quality</div>
            <p className="text-gray-400 text-sm">1080p Resolution</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">AI-Generated</div>
            <p className="text-gray-400 text-sm">Dynamic Duration</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">AI-Powered</div>
            <p className="text-gray-400 text-sm">Smart Summarization</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
