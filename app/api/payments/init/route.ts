// @ts-nocheck
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const FEDAPAY_API = process.env.NODE_ENV === "production" 
  ? "https://api.fedapay.com/v1" 
  : "https://sandbox-api.fedapay.com/v1";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, description, saleId, customerName, customerEmail } = body;

    if (!amount || !saleId) {
      return NextResponse.json({ error: "Montant et ID de vente requis" }, { status: 400 });
    }

    // 1. Créer la transaction chez FedaPay
    const transactionRes = await fetch(`${FEDAPAY_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FEDAPAY_SECRET_KEY}`
      },
      body: JSON.stringify({
        description: description || `Vente FADIMA`,
        amount: Math.round(amount),
        currency: { iso: "XOF" }, // par défaut FCFA
        customer: {
          firstname: customerName || "Client",
          lastname: "Fadima",
          email: customerEmail || "client@fadima.app"
        },
        metadata: {
          sale_id: saleId,
          user_id: user.id
        }
      })
    });

    if (!transactionRes.ok) {
      const errorText = await transactionRes.text();
      console.error("FedaPay Error:", errorText);
      return NextResponse.json({ error: "Erreur lors de la création de la transaction" }, { status: 500 });
    }

    const transactionData = await transactionRes.json();
    const transactionId = transactionData["v1/transaction"]?.id || transactionData.v1_transaction?.id || transactionData.transaction?.id || transactionData.id;

    if (!transactionId) {
       return NextResponse.json({ error: "ID de transaction non reçu" }, { status: 500 });
    }

    // 2. Générer le token de paiement
    const tokenRes = await fetch(`${FEDAPAY_API}/transactions/${transactionId}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FEDAPAY_SECRET_KEY}`
      }
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Erreur lors de la génération du token" }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    // 3. Mettre à jour la vente dans Supabase avec le transaction_id (pending)
    await supabase.from("sales")
      .update({ 
        payment_transaction_id: transactionId.toString(),
        payment_gateway: "fedapay"
      })
      .eq("id", saleId);

    return NextResponse.json({ token, transactionId });

  } catch (error: any) {
    console.error("Payment init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

