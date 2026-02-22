"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import LoadingPage from "@/components/LoadingPage";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ nama: string | null; avatar_url: string | null; level?: number; xp?: number } | null>(null);

  // Message form state
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sent" | "error">("idle");

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // Start a timer for minimum 2 seconds
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          await minLoadingTime;
          router.replace("/login");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("nama, avatar_url, tanggal_lahir")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (!profileData?.tanggal_lahir || !profileData?.avatar_url || !profileData?.nama) {
          await minLoadingTime;
          router.replace("/setup-profile");
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        // Wait for the minimum timer before hiding loading screen
        await minLoadingTime;
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setSendStatus("idle");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("moon_messages")
        .insert({ user_id: session.user.id, message: message.trim() });

      if (error) throw error;

      setSendStatus("sent");
      setMessage("");
      setTimeout(() => setSendStatus("idle"), 2000);
    } catch {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-start bg-black relative overflow-hidden font-mono"
      style={{
        backgroundImage: 'url("/background/2.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0"></div>

      {/* === TOP BAR: Profile Card (kiri) + Logout (kanan) === */}
      <div className="relative z-20 w-full flex items-center justify-between px-4 pt-4 pb-2">
        {/* Profile Card Kiri */}
        <div className="flex items-center gap-3 bg-black border-2 border-cyan-500 px-3 py-2 shadow-[4px_4px_0_rgba(34,211,238,0.4)]">
          {/* Avatar */}
          <div className="relative w-10 h-10 border-2 border-emerald-400 bg-black overflow-hidden flex-shrink-0">
            {profile?.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-emerald-400 text-xs">?</span>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
          </div>
          {/* Info */}
          <div className="flex flex-col">
            <span className="text-cyan-400 font-bold text-xs tracking-widest uppercase">{profile?.nama || "PLAYER"}</span>
            <span className="text-yellow-400 text-xs">LVL: 1</span>
          </div>
        </div>

        {/* Logout Kanan */}
        {/* <button
          onClick={async () => { await supabase.auth.signOut(); router.replace("/login"); }}
          className="px-4 py-2 bg-red-900 text-red-300 border-2 border-red-500 font-bold tracking-widest hover:bg-red-800 hover:text-white transition-all shadow-[3px_3px_0_rgba(239,68,68,0.5)] active:translate-y-px text-xs uppercase"
        >
          LOGOUT
        </button> */}
      </div>

      {/* === HERO SECTION === */}
      <div className="relative flex-grow flex flex-col items-center justify-center z-10 w-full px-4 py-16 gap-16">
        
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[3px_3px_0_rgba(34,211,238,0.8)] tracking-widest text-center uppercase">
            Letters to the Moon
          </h1>
          {/* <p className="text-cyan-300/80 text-sm tracking-[0.2em] text-center max-w-md">
            Jelajahi rahasia antariksa dan kirimkan surat kepada bulan
          </p> */}

          <button
            onClick={() => setShowDialog(true)}
            className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-cyan-500 text-black font-bold text-lg sm:text-xl tracking-widest uppercase border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-1.5 active:translate-y-1.5"
          >
            🌙 START
          </button>
        </div>

        {/* === MESSAGE FORM SECTION === */}
        <div className="w-full max-w-xl bg-black border-4 border-cyan-500 shadow-[8px_8px_0_rgba(34,211,238,0.5)] p-0">
          
          {/* Title Bar */}
          <div className="w-full bg-cyan-500 px-3 sm:px-4 py-2 flex items-center gap-2 border-b-4 border-black">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 border-2 border-black"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 border-2 border-black"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-black"></div>
            <span className="ml-1 sm:ml-2 text-black font-bold text-[10px] sm:text-xs tracking-tight sm:tracking-widest truncate">
              want to say something to the moon? 🚀
            </span>
          </div>

          <form onSubmit={handleSendMessage} className="p-6 flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`> Hey Moon, i want to say...`}
              rows={4}
              className="w-full bg-black border-2 border-cyan-700 text-cyan-300 placeholder-cyan-800 p-3 resize-none focus:outline-none focus:border-cyan-400 text-sm tracking-wide caret-cyan-400"
            />

            {sendStatus === "sent" && (
              <p className="text-emerald-400 text-xs tracking-widest animate-pulse">
                ✅ message sent!
              </p>
            )}
            {sendStatus === "error" && (
              <p className="text-red-400 text-xs tracking-widest">
                ❌ connection failed.
              </p>
            )}

            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="w-full py-3 bg-indigo-600 text-white font-bold tracking-widest uppercase border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0_#000] disabled:translate-x-0"
            >
              {sending ? "Sending..." : "📡 send"}
            </button>
          </form>
        </div>

      </div>

      {/* === "NOT READY" DIALOG === */}
      {showDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowDialog(false)}
        >
          <div 
            className="relative bg-black border-4 border-cyan-500 shadow-[8px_8px_0_rgba(34,211,238,0.5)] p-0 max-w-sm w-full mx-4 font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="w-full bg-cyan-500 px-4 py-2 flex items-center gap-2 border-b-4 border-black">
              <div className="w-3 h-3 bg-red-500 border-2 border-black"></div>
              <div className="w-3 h-3 bg-yellow-400 border-2 border-black"></div>
              <div className="w-3 h-3 bg-green-400 border-2 border-black"></div>
              <span className="ml-2 text-black font-bold text-xs tracking-widest">Firras.MSG</span>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col items-center gap-6 text-center">
              <span className="text-4xl">🌙</span>
              <p className="text-cyan-300 text-base tracking-wide leading-relaxed">
                The game is not ready yet sweet<br />
                
              </p>
              <button
                onClick={() => setShowDialog(false)}
                className="px-8 py-3 bg-indigo-600 text-white font-bold tracking-widest uppercase border-4 border-black shadow-[4px_4px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

