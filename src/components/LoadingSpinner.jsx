import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, message = 'Initializing System...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#000000]/90 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5">
          <div className="relative w-12 h-12 flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
             <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wider uppercase">{message}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
