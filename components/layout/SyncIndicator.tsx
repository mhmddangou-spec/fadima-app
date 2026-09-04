"use client";

import { useEffect, useState } from "react";
import { CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { getPendingSalesCount, syncPendingSales, isOnline } from "@/lib/offlineSync";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SyncIndicator() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(true);
  const router = useRouter();

  const checkStatus = async () => {
    setOnline(isOnline());
    const count = await getPendingSalesCount();
    setPendingCount(count);
  };

  useEffect(() => {
    checkStatus();
    
    const interval = setInterval(checkStatus, 5000);
    window.addEventListener("online", checkStatus);
    window.addEventListener("offline", checkStatus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("online", checkStatus);
      window.removeEventListener("offline", checkStatus);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline()) {
      toast.error("Connexion requise pour synchroniser.");
      return;
    }
    
    setSyncing(true);
    try {
      const synced = await syncPendingSales();
      if (synced > 0) {
        toast.success(`${synced} vente(s) synchronisée(s) !`);
        router.refresh();
      }
    } catch (err) {
      toast.error("Erreur de synchronisation.");
    } finally {
      setSyncing(false);
      checkStatus();
    }
  };

  if (pendingCount === 0 && online) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 z-50 animate-slide-up">
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1.5 flex items-center gap-2">
        {!online ? (
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-full">
            <CloudOff className="w-4 h-4" />
            Mode hors-ligne
            {pendingCount > 0 && <span className="ml-1 font-bold">({pendingCount})</span>}
          </div>
        ) : pendingCount > 0 ? (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
          >
            {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {syncing ? "Synchro..." : `Synchroniser (${pendingCount})`}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            Synchronisé
          </div>
        )}
      </div>
    </div>
  );
}
