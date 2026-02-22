import React from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Define the profile type
type ProfileProps = {
  nama: string | null;
  avatar_url: string | null;
  level?: number; // Mock gamification data
  xp?: number;
};

export default function Navbar({ profile }: { profile: ProfileProps | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (!profile) return null;

  return (
    <nav className="w-full bg-slate-900/90 backdrop-blur-md border-b-4 border-cyan-500 shadow-[0_4px_0_rgba(34,211,238,0.3)] sticky top-0 z-50 font-mono">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Player Info */}
        <div className="flex items-center gap-2 sm:gap-4 bg-black p-1.5 sm:p-2 border-2 border-cyan-500/50 rounded-lg drop-shadow-[2px_2px_0_rgba(34,211,238,0.5)]">
          {/* Avatar Box */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 border-2 border-emerald-400 bg-black overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-400 text-[10px] sm:text-xs">
                ?
              </div>
            )}
            {/* Retro scanline overlay on avatar */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
          </div>

          {/* Name & Stats */}
          <div className="flex flex-col">
            <span className="text-cyan-400 font-bold text-[10px] sm:text-sm tracking-widest uppercase drop-shadow-[1px_1px_0_#000] truncate max-w-[80px] sm:max-w-none">
              {profile.nama || "PLAYER"}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
              <span className="text-yellow-400 text-[9px] sm:text-xs font-bold">LVL: {profile.level || 1}</span>
              <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-800 border border-slate-600">
                <div 
                  className="h-full bg-emerald-400" 
                  style={{ width: `${profile.xp || 45}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Title (Hidden on small screens) */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-white font-bold text-xl tracking-[0.2em] drop-shadow-[2px_2px_0_#ef4444]">
            LETTERS TO THE MOON
          </span>
          {/* <span className="text-cyan-500/70 text-xs tracking-widest">
            TERMINAL V1.0
          </span> */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Settings / Inventory Mock Buttons */}
          <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-indigo-900 border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-800 hover:text-white transition-colors drop-shadow-[2px_2px_0_rgba(99,102,241,0.5)] active:translate-y-1 active:drop-shadow-none">
            ⚙️
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900 text-red-300 border-2 border-red-500 font-bold tracking-widest hover:bg-red-800 hover:text-white transition-all drop-shadow-[2px_2px_0_rgba(239,68,68,0.5)] active:translate-y-1 active:drop-shadow-none uppercase text-xs sm:text-sm"
          >
            LOGOUT
          </button>
        </div>

      </div>
    </nav>
  );
}
