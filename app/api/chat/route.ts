import { createClient } from "@/lib/supabase/server";
import { smoothStream, streamText } from "ai";
import { google } from "@ai-sdk/google";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, context } = await req.json();

    // Construction du system prompt avec le contexte
    const systemPrompt = `Tu es l'assistant IA de FADIMA, une application de gestion pour commerçants et petits business en Afrique (principalement au Bénin, devise: FCFA).
Ton but est d'aider le commerçant à analyser ses ventes, gérer ses dettes, et lui donner des conseils pour développer son affaire. 
Tu dois être encourageant, professionnel mais accessible, en utilisant un langage simple et direct.

Voici les données financières actuelles de l'utilisateur :
- Ventes aujourd'hui : ${context?.todaySales || 0} FCFA
- Dépenses aujourd'hui : ${context?.todayExpenses || 0} FCFA
- Ventes cette semaine : ${context?.weekSales || 0} FCFA
- Dépenses cette semaine : ${context?.weekExpenses || 0} FCFA
- Ventes ce mois : ${context?.monthSales || 0} FCFA
- Total des dettes clients : ${context?.totalDebt || 0} FCFA
- Produits en stock faible : ${
      context?.lowStockProducts?.length > 0
        ? context.lowStockProducts.join(", ")
        : "Aucun"
    }

S'il te pose une question sur son bilan d'aujourd'hui, base-toi sur les données ci-dessus pour lui répondre.
S'il te demande des conseils, donne-lui 2 ou 3 conseils concrets adaptés à sa situation.
Utilise du formatage markdown (gras, listes) pour rendre tes réponses faciles à lire sur un téléphone.
Ne mentionne pas que tu es une IA sauf si on te le demande directement.
Sois motivant et encourageant ! Utilise des emojis pour rendre la conversation vivante.
Garde tes réponses détaillées mais bien structurées (max 200 mots).`;

    // Ne garder que les 6 derniers messages pour accélérer les réponses
    const recentMessages = (messages || []).slice(-6);
    const coreMessages = recentMessages.map((msg: any) => {
      let content = msg.content || "";
      if (msg.role === "assistant" && msg.parts) {
        content = msg.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
      }
      return { role: msg.role, content };
    });

    const result = streamText({
      model: google("gemini-3.6-flash"),
      messages: coreMessages,
      system: systemPrompt,
      temperature: 0.7,
      experimental_transform: smoothStream({ chunking: "word" }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
