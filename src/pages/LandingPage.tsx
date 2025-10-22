import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { Scene3D } from '../components/Scene3D';
import { AnimatedGlobe } from '../components/AnimatedGlobe';
import { ParticleField } from '../components/ParticleField';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const features = [
    { icon: '🎬', title: 'Instant Videos', desc: 'Transform text to video in seconds' },
    { icon: '🤖', title: 'AI Summary', desc: 'Smart content analysis & extraction' },
    { icon: '✨', title: 'Cinematic', desc: 'Beautiful animations & transitions' },
  ];

  return (
    <div className="relative w-full min-h-[100vh] flex flex-col justify-center items-center overflow-hidden">
      <Scene3D enableControls>
        <AnimatedGlobe />
        <ParticleField />
      </Scene3D>

      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 text-center px-6 py-12 max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-gray-300">Transcedning Learning</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-bold mb-4 glow-text leading-tight text-[clamp(3rem,8vw,6rem)]">
            InfoStream
          </h1>

          <p className="text-[clamp(1rem,2vw,2rem)] text-gray-300 mb-2 font-light">
            Transform consuming knowledge
          </p>
          <p className="text-[clamp(1.5rem,3vw,3rem)] bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold mb-8">
            Like Never Before
          </p>

          {/* Description */}
          <p className="text-[clamp(0.875rem,1.5vw,1.25rem)] text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Convert lifeless text into captivating visual imersion.
          </p>
          <p className="text-[clamp(0.875rem,1.5vw,1.25rem)] text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Experience KNOWLEDGE like never before.
          </p>

          {/* Start Button */}
          <motion.button
            onClick={onStart}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 glass glow rounded-full text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              <Play className="w-5 h-5" />
              Learn curiously
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="glass p-4 sm:p-6 rounded-2xl hover:glow transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
