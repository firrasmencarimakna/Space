"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import LoadingPage from "@/components/LoadingPage";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // When using simple Supabase Auth (implicit grant), the token exists in the hash url
    // Since we are using createClient on client side, Supabase auto-listens to the hash change
    // and updates the session automatically behind the scenes.
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Session successfully set, redirect to main page, which handles routing logic
        router.replace("/");
      } else if (event === 'SIGNED_OUT') {
        router.replace("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return <LoadingPage />;
}
