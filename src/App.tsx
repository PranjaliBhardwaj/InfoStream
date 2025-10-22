  import { useState } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { LandingPage } from './pages/LandingPage';
  import { InputPage } from './pages/InputPage';
  import { ProcessingPage } from './pages/ProcessingPage';
  import { ResultPage } from './pages/ResultPage';
  import { useMouseParallax } from './hooks/useMouseParallax';

  type Page = 'landing' | 'input' | 'processing' | 'result';

  function App() {
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [articleText, setArticleText] = useState('');
    const mousePosition = useMouseParallax(15);

    const handleStart = () => {
      setCurrentPage('input');
    };

    const handleGenerate = (text: string) => {
      setArticleText(text);
      setCurrentPage('processing');
    };

    const handleProcessingComplete = () => {
      setCurrentPage('result');
    };

    const handleRegenerate = () => {
      setCurrentPage('processing');
      setTimeout(() => {
        setCurrentPage('result');
      }, 10000);
    };

    const handleNewVideo = () => {
      setArticleText('');
      setCurrentPage('input');
    };

    const handleBackToLanding = () => {
      setCurrentPage('landing');
    };

    return (
      <div className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          <div className="absolute top-20 left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
        </motion.div>

        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onStart={handleStart} />
            </motion.div>
          )}

          {currentPage === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <InputPage onGenerate={handleGenerate} onBack={handleBackToLanding} />
            </motion.div>
          )}

          {currentPage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <ProcessingPage onComplete={handleProcessingComplete} />
            </motion.div>
          )}

          {currentPage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <ResultPage onRegenerate={handleRegenerate} onNewVideo={handleNewVideo} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
        </motion.div>
      </div>
    );
  }

  export default App;
