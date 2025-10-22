import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link2, FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { Scene3D } from '../components/Scene3D';
import { WaveGrid } from '../components/WaveGrid';

interface InputPageProps {
  onGenerate: (text: string) => void;
  onBack: () => void;
}

export function InputPage({ onGenerate, onBack }: InputPageProps) {
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onGenerate(input);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <Scene3D>
        <WaveGrid />
      </Scene3D>

      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 w-full max-w-3xl">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 glow-text">Create Your Video</h2>
          <p className="text-gray-400 text-lg">
            Paste an article URL or enter text directly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass p-8 rounded-3xl glow"
        >
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputMode('url')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                inputMode === 'url'
                  ? 'bg-violet-600 text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <Link2 className="w-5 h-5 inline mr-2" />
              Article URL
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                inputMode === 'text'
                  ? 'bg-violet-600 text-white'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Direct Text
            </button>
          </div>

          {inputMode === 'url' ? (
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Article URL</label>
              <input
                type="url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full px-4 py-4 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Article Text</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your article text here..."
                rows={8}
                className="w-full px-4 py-4 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none"
              />
            </div>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={!input.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Generate Video
          </motion.button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Processing typically takes 10-30 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}
