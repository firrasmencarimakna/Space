"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage({ type: "success", text: "Selamat datang kembali, Kapten!" });
      router.replace("/");
    } catch (error) {
      const e = error as Error;
      setMessage({ type: "error", text: e.message || "Terjadi kesalahan saat transmisi." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      const e = error as Error;
      setMessage({ type: "error", text: e.message || "Terjadi kesalahan saat otentikasi Google." });
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden"
      style={{
        backgroundImage: 'url("/background/8bit5.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      {/* Mobile-safe scrollable wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8 min-h-screen">

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono tracking-wider drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            Letters to the Moon
          </h1>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-sm sm:max-w-md p-5 sm:p-8 rounded-2xl backdrop-blur-xl bg-slate-900/50 border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.2)]">

        {message && (
          <div className={`p-4 mb-6 rounded-md border text-sm font-mono ${
            message.type === 'error' 
              ? "bg-red-900/30 border-red-500/50 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : "bg-emerald-900/30 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-mono text-indigo-300 uppercase tracking-widest pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              placeholder="kapten@fleet.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-indigo-300 uppercase tracking-widest pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-lg bg-indigo-600 text-white font-bold tracking-widest font-mono p-4 mt-4 hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative">{isLoading ? "Loading..." : "Login"}</span>
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-indigo-500/30"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-mono text-indigo-300 tracking-widest">or</span>
          <div className="flex-grow border-t border-indigo-500/30"></div>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 relative group overflow-hidden rounded-lg bg-black/40 border border-white/10 text-white font-bold tracking-widest font-mono p-4 hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          LOGIN WITH GOOGLE
        </button>
        </div>{/* End Form Card */}
      </div>{/* End Scroll Wrapper */}

      {/* Decorative Elements – hidden on mobile */}
      <div className="absolute top-10 left-10 text-cyan-500/30 font-mono text-xs hidden md:block">
        SYS.REQ: OK<br />
        NET.LINK: ESTABLISHED<br />
        SEC.LVL: ALPHA
      </div>
      <div className="absolute bottom-10 right-10 text-cyan-500/30 font-mono text-xs text-right hidden md:block border-r-2 border-cyan-500/30 pr-2">
        COORD: 45.92.11<br />
        ZONE: ORION NEBULA
      </div>
    </div>
  );
}
