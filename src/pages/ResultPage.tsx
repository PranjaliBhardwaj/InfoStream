import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Share2, CheckCircle, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Scene3D } from '../components/Scene3D';
import { ParticleField } from '../components/ParticleField';

interface ResultPageProps {
  onRegenerate: () => void;
  onNewVideo: () => void;
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

const styleVariants = {
  'anime': 'ADmA6zqY8hY',
  'cinematic': '-Y1EhjvU1-w',
  'minimal': 'jNQXAC9IVRw'
};

export function ResultPage({ onRegenerate, onNewVideo }: ResultPageProps) {
  const [currentVideoId, setCurrentVideoId] = useState('-Y1EhjvU1-w');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    setTimeout(() => {
      let botResponse = 'Okay';
      let newVideoId = currentVideoId;

      if (userMessage.includes('anime')) {
        botResponse = 'Okay, switching to anime style';
        newVideoId = styleVariants.anime;
      } else if (userMessage.includes('cinematic')) {
        botResponse = 'Okay, applying cinematic effects';
        newVideoId = styleVariants.cinematic;
      } else if (userMessage.includes('minimal')) {
        botResponse = 'Okay, creating minimal version';
        newVideoId = styleVariants.minimal;
      } else {
        botResponse = 'Okay, processing your request';
      }

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);

      if (newVideoId !== currentVideoId) {
        setTimeout(() => {
          setCurrentVideoId(newVideoId);
        }, 1000);
      }
    }, 500);
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
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&iv_load_policy=3&disablekb=1`}
                  title="Generated Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
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
                          <p className="mb-4">Ask me to modify your video!</p>
                          <div className="space-y-2">
                            <p className="text-xs text-violet-400 font-semibold">Try saying:</p>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => setInput('Make it anime type')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                Make it anime type
                              </button>
                              <button
                                onClick={() => setInput('Make it cinematic')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                Make it cinematic
                              </button>
                              <button
                                onClick={() => setInput('Make it minimal')}
                                className="px-3 py-2 glass rounded-lg hover:glow transition-all text-xs hover:text-violet-300"
                              >
                                Make it minimal
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
                    </div>

                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={input} 
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your request..."
                          className="flex-1 px-4 py-2 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm"
                        />
                        <motion.button
                          onClick={handleSendMessage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all"
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
                    Click to customize your video
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
            <div className="text-3xl font-bold text-blue-400 mb-2">45 sec</div>
            <p className="text-gray-400 text-sm">Optimal Length</p>
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
