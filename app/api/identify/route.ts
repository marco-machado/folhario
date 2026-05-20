import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Verify environment variables
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "A chave de API GEMINI_API_KEY não foi configurada. Insira-a nas configurações de Secrets para ativar a identificação por IA." },
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
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "Nenhuma imagem foi fornecida." }, { status: 400 });
    }

    // Clean up base64 prefix if present
    let base64Data = image;
    let mimeType = "image/jpeg";

    if (image.includes(";base64,")) {
      const parts = image.split(";base64,");
      const mimePart = parts[0];
      base64Data = parts[1];
      if (mimePart.includes(":")) {
        mimeType = mimePart.split(":")[1];
      }
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Você é um botânico especialista e amigável que escreve conteúdo para iniciantes em jardinagem no Brasil. Identifique esta planta e preencha as informações detalhadas em português (pt-BR). Não use jargões científicos difíceis ou termos ambíguos. Seja preciso mas simples. Se o objeto na imagem não for uma planta ou não puder ser identificado, preencha os campos de forma realista com aviso adequado.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: {
              type: Type.STRING,
              description: "Nome comum da planta em português (ex: Jiboia, Suculenta, etc.)",
            },
            botanicalName: {
              type: Type.STRING,
              description: "Nome científico oficial da planta em latim",
            },
            confidence: {
              type: Type.STRING,
              description: "Porcentagem e nível de certeza humorado em português (ex: '95% (Certezíssima!)')",
            },
            description: {
              type: Type.STRING,
              description: "Descrição super simples e carinhosa da planta para o público leigo",
            },
            lightNeed: {
              type: Type.STRING,
              description: "Necessidade de luminosidade simplificada (ex: 'Muita luz sem sol direto (Luz Difusa)')",
            },
            wateringFrequency: {
              type: Type.STRING,
              description: "Frequência de irrigação explicada passo a passo simples (ex: 'Apenas quando a terra estiver bem seca no topo')",
            },
            wateringIntervalDays: {
              type: Type.INTEGER,
              description: "Intervalo padrão aproximado em dias inteiros entre regas recomendável (ex: 7 para uma vez por semana, 3 para plantas úmidas, 15 para suculentas)",
            },
            quickTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Três dicas práticas, curtas e certeiras para manter essa planta viva sem erro",
            },
            warning: {
              type: Type.STRING,
              description: "Aviso de toxicidade sobre pets ou crianças em português (ex: 'Tóxica para cães e gatos!' ou 'Livre de perigo para pets e crianças!')",
            },
          },
          required: [
            "commonName",
            "botanicalName",
            "confidence",
            "description",
            "lightNeed",
            "wateringFrequency",
            "wateringIntervalDays",
            "quickTips",
            "warning",
          ],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    return new NextResponse(jsonText, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro na rota de identificação:", error);
    return NextResponse.json(
      { error: `Erro ao processar imagem: ${error.message || error}` },
      { status: 500 }
    );
  }
}
