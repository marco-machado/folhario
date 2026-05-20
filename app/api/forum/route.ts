import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "A chave de API GEMINI_API_KEY não está configurada." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const body = await req.json();
    const { question, plantContext, role } = body;

    if (!question) {
      return NextResponse.json({ error: "Nenhuma pergunta foi fornecida." }, { status: 400 });
    }

    let systemInstruction = "";
    if (role === "seu_sebastiao") {
      systemInstruction = `Você é o "Seu Sebastião", um senhor brasileiro de 68 anos, jardineiro raiz super experiente e carinhoso. 
Você dá conselhos pragmáticos, usa expressões populares gentis (como "meu filho", "minha filha", "olha só que beleza", "coloque amor na terra"), prefere soluções orgânicas e naturais (borra de café, água da casca de ovo, fumo de rolo contra pulgão). 
Sua resposta deve ser curta, calorosa, muito direta e escrita de forma natural, sem formatação científica robótica. Sempre em português do Brasil (pt-BR).`;
    } else {
      systemInstruction = `Você é a "Dona Flor", uma jovem entusiasmada criadora do conceito "Urban Jungle" no apartamento dela em São Paulo. 
Você adora falar sobre iluminação (luz leste, luz filtrada), substratos adequados (perlita, casca de pinus, drenagem leve), e é super antenada em estética de folhagens grandes e brilho nas folhas. 
Seu tom é motivado, amigável, repleto de energia e carinho, usando expressões leves (como "perfeito para a sua selva!", "vamos salvar essa folhinha!"). 
Sua resposta deve ser curta, animada, muito direta e prática. Sempre em português do Brasil (pt-BR).`;
    }

    const contextPart = plantContext ? `A pessoa está perguntando sobre a planta: "${plantContext}".` : "";
    const prompt = `${contextPart}\nPergunta enviada pelo membro novato da comunidade: "${question}"\n\nDê sua resposta de especialista de modo cativante e acolhedor de acordo com sua personalidade.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const answer = response.text ? response.text.trim() : "Desculpe, deu um vento forte aqui e não consegui ouvir bem a sua pergunta. Pode falar de novo?";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Erro na rota do fórum:", error);
    return NextResponse.json(
      { error: `Erro no servidor do fórum: ${error.message || error}` },
      { status: 500 }
    );
  }
}
