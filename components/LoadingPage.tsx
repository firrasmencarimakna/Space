import React from "react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden font-mono px-4">
      
      {/* Retro scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50"></div>

      {/* Main retro container */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-2xl flex flex-col items-center justify-center border-4 border-cyan-500 bg-black/80 shadow-[6px_6px_0px_#22d3ee] sm:shadow-[10px_10px_0px_#22d3ee]" style={{ minHeight: '220px' }}>
        
        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full h-7 sm:h-8 bg-cyan-500 flex items-center px-3 sm:px-4 border-b-4 border-black">
          <span className="text-black font-bold text-xs sm:text-sm tracking-widest shrink-0">load.exe</span>
          <div className="ml-auto w-3 h-3 sm:w-4 sm:h-4 bg-black animate-pulse"></div>
        </div>

        {/* Floating Astronaut (Kiri) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/icon/astro.gif" 
          alt="Astronaut" 
          className="absolute top-1/2 -translate-y-1/2 left-1 sm:left-4 md:left-12 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain animate-[bounce_4s_ease-in-out_infinite]"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Right Astronaut (Kanan) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/icon/astro.gif" 
          alt="Astronaut" 
          className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-4 md:right-12 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain animate-[bounce_4s_ease-in-out_infinite]"
          style={{ imageRendering: 'pixelated', animationDelay: '2s' }}
        />

        {/* Center UI */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center justify-center text-center py-6 px-16 sm:px-20 md:px-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-cyan-400 font-bold mb-4 sm:mb-6 drop-shadow-[2px_2px_0px_#000]">
            LOADING<span className="animate-[pulse_1s_ease-in-out_infinite]">...</span>
          </h2>
          
          {/* Retro Progress Bar */}
          <div className="w-40 sm:w-52 md:w-64 h-5 sm:h-6 md:h-8 border-4 border-cyan-500 p-1 bg-black">
            <div className="h-full bg-cyan-400 animate-[pulse_1.5s_ease-in-out_infinite] w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
