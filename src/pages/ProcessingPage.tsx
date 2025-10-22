import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { Scene3D } from '../components/Scene3D';
import { TextParticles } from '../components/TextParticles';

interface ProcessingPageProps {
  onComplete: () => void;
}

export function ProcessingPage({ onComplete }: ProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Analyzing content...');

  useEffect(() => {
    const stages = [
      { text: 'Analyzing content...', duration: 2000 },
      { text: 'Extracting key points...', duration: 2000 },
      { text: 'Generating summary...', duration: 2000 },
      { text: 'Creating visual scenes...', duration: 2000 },
      { text: 'Rendering video...', duration: 2000 },
    ];

    let currentStage = 0;
    let progressValue = 0;

    const updateStage = () => {
      if (currentStage < stages.length) {
        setStage(stages[currentStage].text);
        currentStage++;
        setTimeout(updateStage, stages[currentStage - 1]?.duration || 0);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    const progressInterval = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      if (progressValue >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    updateStage();

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Scene3D>
        <TextParticles />
      </Scene3D>

      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 opacity-20 blur-xl absolute inset-0" />
              <Loader2 className="w-24 h-24 text-violet-400 relative" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold mb-4 glow-text">
            Creating Your Video
          </h2>

          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-300 mb-8"
          >
            {stage}
          </motion.p>

          <div className="w-full max-w-md mx-auto mb-6">
            <div className="glass rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-center gap-3 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">
                AI is analyzing and transforming your content
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 text-gray-500 text-sm"
        >
          This may take a few moments...
        </motion.div>
      </div>
    </div>
  );
}
