import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative w-12 h-12">
        {/* Outer subtle ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border/60"></div>
        {/* Spinning indicator */}
        <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent animate-spin"></div>
      </div>
      <p className="font-display font-bold text-xs text-text-secondary tracking-widest animate-pulse uppercase">
        Loading
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg/85 backdrop-blur-md z-[9999] flex items-center justify-center transition-all duration-300">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default Loader;
