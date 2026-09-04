import localforage from "localforage";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const SALES_QUEUE_KEY = "fadima_sales_sync_queue";

export interface PendingSale {
  id: string; // uuid for local tracking
  saleData: any;
  itemsData: any[];
  timestamp: number;
}

export async function saveSaleOffline(saleData: any, itemsData: any[]): Promise<void> {
  const pendingSale: PendingSale = {
    id: crypto.randomUUID(),
    saleData,
    itemsData,
    timestamp: Date.now(),
  };

  const queue: PendingSale[] = (await localforage.getItem(SALES_QUEUE_KEY)) || [];
  queue.push(pendingSale);
  await localforage.setItem(SALES_QUEUE_KEY, queue);
}

export async function getPendingSalesCount(): Promise<number> {
  const queue: PendingSale[] = (await localforage.getItem(SALES_QUEUE_KEY)) || [];
  return queue.length;
}

export async function syncPendingSales(): Promise<number> {
  const queue: PendingSale[] = (await localforage.getItem(SALES_QUEUE_KEY)) || [];
  if (queue.length === 0) return 0;

  const supabase = createClient();
  let syncedCount = 0;
  const newQueue = [...queue];

  for (let i = 0; i < queue.length; i++) {
    const pending = queue[i];
    try {
      // 1. Inserer la vente
      const { data: saleRes, error: saleErr } = await supabase
        .from("sales")
        .insert(pending.saleData)
        .select()
        .single();
      
      if (saleErr) throw saleErr;

      // 2. Inserer les items
      if (pending.itemsData.length > 0) {
        const itemsToInsert = pending.itemsData.map(item => ({
          ...item,
          sale_id: saleRes.id
        }));

        const { error: itemsErr } = await supabase
          .from("sale_items")
          .insert(itemsToInsert);

        if (itemsErr) throw itemsErr;
      }

      // En cas de succès, retirer de la file
      syncedCount++;
      const index = newQueue.findIndex(q => q.id === pending.id);
      if (index !== -1) newQueue.splice(index, 1);

    } catch (err) {
      console.error("Erreur de synchronisation pour la vente:", pending.id, err);
      // On garde dans la file pour le prochain essai
    }
  }

  await localforage.setItem(SALES_QUEUE_KEY, newQueue);
  return syncedCount;
}

export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}
