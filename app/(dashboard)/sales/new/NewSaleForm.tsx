// @ts-nocheck
"use client";

declare global {
  interface Window {
    FedaPay: any;
  }
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Loader2, Plus, Minus, Calculator } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCFA, generateSaleNumber, cn } from "@/lib/utils/format";
import toast from "react-hot-toast";
import { saveSaleOffline, isOnline } from "@/lib/offlineSync";

interface Product {
  id: string;
  name: string;
  selling_price: number;
  stock_quantity: number;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface NewSalePageProps {
  products: Product[];
  customers: Customer[];
  userId: string;
}

interface CartItem {
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export default function NewSaleForm({ products, customers, userId }: NewSalePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    { product_name: "", quantity: 1, unit_price: 0 },
  ]);
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_money" | "other" | "credit">("cash");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "partial" | "unpaid">("paid");
  const [paidAmount, setPaidAmount] = useState<number | "">("");
  const [soldAt, setSoldAt] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState("");
  const [focusedProductIndex, setFocusedProductIndex] = useState<number | null>(null);

  const total = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  const addCartItem = () => {
    setCart([...cart, { product_name: "", quantity: 1, unit_price: 0 }]);
  };

  const removeCartItem = (i: number) => {
    setCart(cart.filter((_, idx) => idx !== i));
  };

  const updateCartItem = (i: number, field: keyof CartItem, value: string | number) => {
    const updated = [...cart];
    if (field === "product_name") {
      // Auto-remplir le prix si un produit connu est sélectionné
      const prod = products.find((p) => p.id === value || p.name === value);
      if (prod) {
        updated[i] = {
          ...updated[i],
          product_id: prod.id,
          product_name: prod.name,
          unit_price: prod.selling_price,
        };
      } else {
        updated[i] = { ...updated[i], product_name: value as string, product_id: undefined };
      }
    } else {
      (updated[i] as unknown as Record<string, unknown>)[field] = value;
    }
    setCart(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.some((item) => !item.product_name || item.unit_price <= 0)) {
      toast.error("Veuillez remplir tous les produits.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const actualPaidAmount = paymentStatus === "paid" ? total : (paidAmount as number) || 0;

      // Créer ou récupérer le client
      let finalCustomerId = customerId || undefined;
      if (!customerId && customerName) {
        const { data: newCustomer } = await supabase
          .from("customers")
          .insert({ user_id: userId, name: customerName })
          .select("id")
          .single();
        finalCustomerId = newCustomer?.id;
      }

      if (paymentMethod === "mobile_money" && !isOnline()) {
        toast.error("Le paiement par Mobile Money nécessite une connexion Internet.");
        setLoading(false);
        return;
      }

      if (!isOnline()) {
        // Mode Hors-ligne
        const saleData = {
          user_id: userId,
          customer_id: finalCustomerId,
          sale_number: generateSaleNumber(),
          total_amount: total,
          paid_amount: actualPaidAmount,
          discount_amount: 0,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          notes,
          sold_at: new Date(soldAt).toISOString(),
        };

        const itemsData = cart.map((item) => ({
          user_id: userId,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        }));

        await saveSaleOffline(saleData, itemsData);
        toast.success("Hors-ligne : Vente enregistrée en attente de synchronisation ✓");
        router.push("/sales");
        router.refresh();
        return;
      }

      // Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: userId,
          customer_id: finalCustomerId,
          sale_number: generateSaleNumber(),
          total_amount: total,
          paid_amount: paymentMethod === "mobile_money" ? 0 : actualPaidAmount,
          discount_amount: 0,
          payment_method: paymentMethod,
          payment_status: paymentMethod === "mobile_money" ? "unpaid" : paymentStatus,
          notes,
          sold_at: new Date(soldAt).toISOString(),
        })
        .select("id")
        .single();

      if (saleError) throw saleError;

      // Créer les lignes de vente
      await supabase.from("sale_items").insert(
        cart.map((item) => ({
          sale_id: sale!.id,
          user_id: userId,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
        }))
      );

      // Créer une dette si paiement partiel, impayé, ou en attente de mobile money
      if ((paymentStatus !== "paid" || paymentMethod === "mobile_money") && finalCustomerId) {
        const remainingAmount = total - actualPaidAmount;
        await supabase.from("debts").insert({
          user_id: userId,
          customer_id: finalCustomerId,
          sale_id: sale!.id,
          customer_name: customerName || customers.find((c) => c.id === customerId)?.name || "Client",
          initial_amount: total,
          paid_amount: paymentMethod === "mobile_money" ? 0 : actualPaidAmount,
          remaining_amount: paymentMethod === "mobile_money" ? total : remainingAmount,
          status: paymentMethod === "mobile_money" ? "unpaid" : (paymentStatus === "unpaid" ? "unpaid" : "partial"),
        });

        // Mettre à jour le total_debt du client
        await supabase.rpc("update_customer_debt" as never, {
          p_customer_id: finalCustomerId,
          p_amount: paymentMethod === "mobile_money" ? total : remainingAmount,
        });
      }

      // Si Mobile Money, lancer FedaPay
      if (paymentMethod === "mobile_money") {
        const initRes = await fetch("/api/payments/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: actualPaidAmount, // On paie ce que l'utilisateur a défini comme "paidAmount" ou "total"
            description: `Vente #${sale!.id.slice(0, 8)}`,
            saleId: sale!.id,
            customerName: customerName || customers.find((c) => c.id === customerId)?.name,
          }),
        });

        const initData = await initRes.json();
        if (!initRes.ok) throw new Error(initData.error || "Erreur init paiement");

        if (window.FedaPay) {
          const widget = window.FedaPay.init({
            public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
            transaction: {
              id: initData.transactionId,
              token: initData.token,
            },
            onComplete: (resp: any) => {
              if (resp.reason === "FedaPay.Checkout.Canceled") {
                toast.error("Paiement annulé. La vente est enregistrée comme impayée.");
              } else {
                toast.success("Paiement Mobile Money réussi !");
              }
              router.push("/sales");
              router.refresh();
            },
          });
          widget.open();
          return; // Ne pas rediriger tout de suite, on attend le widget
        } else {
          toast.error("Le widget de paiement n'a pas pu être chargé.");
        }
      }

      toast.success("Vente enregistrée ✓");
      router.push("/sales");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/sales" className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nouvelle vente</h1>
          <p className="text-gray-500 text-sm">Enregistrez une vente rapidement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Produits */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            Produits vendus
          </h2>

          <div className="space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="space-y-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Produit {i + 1}</span>
                  {cart.length > 1 && (
                    <button type="button" onClick={() => removeCartItem(i)} className="text-red-400 hover:text-red-600 p-1">
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Nom du produit avec Autocomplete personnalisé */}
                <div className="relative">
                  <input
                    type="text"
                    className="input"
                    placeholder="Nom du produit (ex: Chaussures)"
                    value={item.product_name}
                    onChange={(e) => updateCartItem(i, "product_name", e.target.value)}
                    onFocus={() => setFocusedProductIndex(i)}
                    onBlur={() => setTimeout(() => setFocusedProductIndex(null), 200)}
                    required
                  />
                  {focusedProductIndex === i && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {products
                        .filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase()))
                        .map(p => (
                          <div
                            key={p.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                            onClick={() => {
                              updateCartItem(i, "product_name", p.name);
                              setFocusedProductIndex(null);
                            }}
                          >
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500">{formatCFA(p.selling_price)} - Stock: {p.stock_quantity}</div>
                          </div>
                      ))}
                      {products.filter(p => p.name.toLowerCase().includes(item.product_name.toLowerCase())).length === 0 && (
                        <div className="p-3 text-sm text-gray-500 text-center">Aucun produit trouvé</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sélection rapide produit */}
                {products.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {products.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateCartItem(i, "product_name", p.id)}
                        className="px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-lg whitespace-nowrap hover:border-primary-400 hover:text-primary-700 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quantité + Prix */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-xs">Quantité</label>
                    <input
                      type="number"
                      className="input"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateCartItem(i, "quantity", parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label text-xs">Prix unitaire (FCFA)</label>
                    <input
                      type="number"
                      className="input"
                      min={0}
                      placeholder="0"
                      value={item.unit_price || ""}
                      onChange={(e) => updateCartItem(i, "unit_price", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                {/* Sous-total */}
                {item.unit_price > 0 && (
                  <div className="text-right text-sm font-semibold text-primary-700">
                    Sous-total: {formatCFA(item.quantity * item.unit_price)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addCartItem} className="btn-outline w-full justify-center mt-4 text-sm">
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </button>
        </div>

        {/* TOTAL */}
        {total > 0 && (
          <div className="bg-primary-600 rounded-xl p-4 text-center text-white">
            <p className="text-primary-100 text-sm">Total</p>
            <p className="text-3xl font-bold mt-1">{formatCFA(total)}</p>
          </div>
        )}

        {/* Paiement */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Paiement</h2>

          {/* Mode de paiement */}
          <div>
            <label className="input-label">Mode de paiement</label>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "mobile_money", "other"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium border-2 transition-colors",
                    paymentMethod === m
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {m === "cash" ? "💵 Espèces" : m === "mobile_money" ? "📱 Mobile Money" : "🔄 Autre"}
                </button>
              ))}
            </div>
          </div>

          {/* Statut du paiement */}
          <div>
            <label className="input-label">Statut du paiement</label>
            <div className="grid grid-cols-3 gap-2">
              {(["paid", "partial", "credit"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setPaymentStatus(s === "credit" ? "unpaid" : s);
                  }}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium border-2 transition-colors",
                    (paymentStatus === s || (s === "credit" && paymentStatus === "unpaid"))
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {s === "paid" ? "✅ Payé" : s === "partial" ? "⚡ Partiel" : "📋 Crédit"}
                </button>
              ))}
            </div>
          </div>

          {/* Montant payé si partiel */}
          {paymentStatus === "partial" && (
            <div>
              <label className="input-label">Montant payé</label>
              <input
                type="number"
                className="input"
                placeholder="Montant reçu en FCFA"
                min={0}
                max={total}
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              />
              {typeof paidAmount === "number" && paidAmount > 0 && (
                <p className="text-sm text-red-600 mt-1 font-medium">
                  Reste à payer: {formatCFA(total - paidAmount)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Client + Date */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Informations complémentaires</h2>

          {/* Client */}
          <div>
            <label className="input-label">Client (facultatif)</label>
            {customers.length > 0 ? (
              <select
                className="select"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  const c = customers.find((c) => c.id === e.target.value);
                  setCustomerName(c?.name || "");
                }}
              >
                <option value="">Client inconnu / Vente directe</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} {c.phone ? `— ${c.phone}` : ""}</option>
                ))}
                <option value="__new">+ Nouveau client</option>
              </select>
            ) : (
              <input
                type="text"
                className="input"
                placeholder="Nom du client (facultatif)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            )}
            {customerId === "__new" && (
              <input
                type="text"
                className="input mt-2"
                placeholder="Nom du nouveau client"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setCustomerId(""); }}
              />
            )}
          </div>

          {/* Date */}
          <div>
            <label className="input-label">Date de vente</label>
            <input
              type="datetime-local"
              className="input"
              value={soldAt}
              onChange={(e) => setSoldAt(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="input-label">Notes (facultatif)</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Ex: Livraison à domicile, remise accordée..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Bouton soumettre */}
        <button
          type="submit"
          disabled={loading || total === 0}
          className="btn-primary w-full justify-center text-base py-4"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
          ) : (
            <><ShoppingBag className="w-5 h-5" /> Enregistrer la vente — {formatCFA(total)}</>
          )}
        </button>
      </form>
    </div>
  );
}

