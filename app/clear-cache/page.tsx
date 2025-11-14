"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClearCachePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all localStorage
    localStorage.clear();
    
    // Show message
    console.log("✅ Cache cleared!");
    
    // Redirect to dashboard after 1 second
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2332] to-[#0f1419]">
      <div className="text-center">
        <div className="text-6xl mb-4">🧹</div>
        <h1 className="text-2xl font-bold text-white mb-2">Clearing Cache...</h1>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
