import type { ProsConsResponse } from "../../interfaces";

export async function * ProsConsStreamGeneratorUseCase (prompt: string, abortSignal: AbortSignal) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        //TODO abortSignal
        signal: abortSignal
      },
    );
    if (!res.ok) throw new Error("Error al comparar");
    const reader = res.body?.getReader();
    if (!reader) {
      console.log('No se pudo generar el reader');
      
      return null;
    }
    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedChunk = decoder.decode(value,  { stream: true });
      text += decodedChunk;
      yield text;
    }
    
  } catch (error) {
    return null;
  }
};
