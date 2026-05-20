import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Verify environment variables
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
    const { image, plantName } = body;

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
      text: `Analise as folhas e o aspecto desta planta ${plantName ? `(${plantName})` : ""} para identificar sinais visuais de pragas (cochonilhas, ácaros, pulgões), doenças fúngicas/bacterianas ou problemas de cultivo (excesso de sol, falta de água, excesso de água). 
Forneça um feedback prático, livre de termos científicos impenetráveis, ideal para um completo iniciante em português (pt-BR).`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issueFound: {
              type: Type.BOOLEAN,
              description: "Indica se alguma praga, doença ou estresse físico foi detectado na imagem (true/false)",
            },
            issueName: {
              type: Type.STRING,
              description: "Nome comum do problema em português (ex: 'Cochonilha Branca', 'Fungos de Solo', 'Sol Forte Demais')",
            },
            severity: {
              type: Type.STRING,
              description: "Nível de gravidade do problema em português (ex: 'Baixa', 'Média' ou 'Crítica')",
            },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista com 2 ou 3 sintomas visuais vistos na imagem que confirmam o diagnóstico",
            },
            remedy: {
              type: Type.STRING,
              description: "Remédio caseiro passo a passo simplificado para o iniciante aplicar imediatamente (ex: borrifar calda de sabão neutro)",
            },
            preventiveAdvice: {
              type: Type.STRING,
              description: "Conselho para que esse problema não volte a afetar as plantas no futuro",
            },
          },
          required: [
            "issueFound",
            "issueName",
            "severity",
            "symptoms",
            "remedy",
            "preventiveAdvice",
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
    console.error("Erro na rota de análise de pragas:", error);
    return NextResponse.json(
      { error: `Erro ao analisar saúde da planta: ${error.message || error}` },
      { status: 500 }
    );
  }
}
