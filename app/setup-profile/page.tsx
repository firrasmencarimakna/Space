"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import LoadingPage from "@/components/LoadingPage";

export default function SetupProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  // Form fields
  const [nama, setNama] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      let isRedirecting = false;
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          isRedirecting = true;
          await minLoadingTime;
          router.replace("/login");
          return;
        }

        setUser(session.user);

        // Pre-fill nama kalau ada dan belum diisikan
        const { data: profile } = await supabase
          .from("profiles")
          .select("nama, avatar_url, tanggal_lahir")
          .eq("id", session.user.id)
          .single();

        if (profile?.nama) setNama(profile.nama);
        if (profile?.tanggal_lahir) setTanggalLahir(profile.tanggal_lahir);
        if (profile?.avatar_url) setAvatarPreview(profile.avatar_url);

      } catch (err) {
        console.error(err);
      } finally {
        if (!isRedirecting) {
          await minLoadingTime;
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      let finalAvatarUrl = avatarPreview;

      // Upload avatar jika ada file baru
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        
        finalAvatarUrl = publicURLData.publicUrl;
      }

      // Pastikan semua terisi
      if (!nama || !tanggalLahir || !finalAvatarUrl) {
        throw new Error("Identitas belum lengkap. Pastikan Nama, Foto, dan Tanggal Lahir sudah terisi.");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          nama,
          tanggal_lahir: tanggalLahir,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setMessage({ type: "success", text: "Profil berhasil dibuat...." });
      
      // Redirect ke laman utama setelah sukses
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err) {
      const error = err as Error;
      setMessage({ type: "error", text: error.message || "Gagal menyimpan data." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
      style={{
        backgroundImage: 'url("/background/8bit5.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Mobile-safe scrollable wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        
        <div className="w-full max-w-sm sm:max-w-lg p-5 sm:p-8 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] scroll-m-8">
          
          <div className="text-center mb-8 border-b border-emerald-500/30 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 font-mono tracking-wider drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              Setup Profile
            </h1>
          </div>

        {message && (
          <div className={`p-4 mb-6 rounded-md border text-sm font-mono tracking-wide ${
            message.type === 'error' 
              ? "bg-red-900/30 border-red-500/50 text-red-200" 
              : "bg-emerald-900/30 border-emerald-500/50 text-emerald-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full border-2 border-emerald-500/50 overflow-hidden bg-black/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {avatarPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-emerald-500/50 text-xs font-mono text-center">Photo<br/>Profile</span>
              )}
            </div>
            <label className="cursor-pointer bg-emerald-900/40 border border-emerald-500/30 hover:bg-emerald-800/60 transition-colors text-emerald-200 text-xs font-mono tracking-widest py-2 px-4 rounded">
              Choose Photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-emerald-300 uppercase tracking-widest pl-1">
              Name
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full bg-black/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-white placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
              placeholder="Firras?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-emerald-300 uppercase tracking-widest pl-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              required
              className="w-full bg-black/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-white placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full relative group overflow-hidden rounded-lg bg-emerald-600 text-black font-bold tracking-widest font-mono p-4 mt-6 hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {saving ? "Saving..." : "Confirm"}
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
);
}
