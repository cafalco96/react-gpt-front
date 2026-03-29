import type { TranslateResponse } from "../../interfaces/";

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt, lang })
        });
        if (!res.ok) throw new Error("Error al traducir el texto");
        const data = await res.json() as TranslateResponse;
        return {
          ok: true,
          ...data,
        }
  } catch (error) {
    return {
      ok: false,
      message: "Error al traducir"
    }
  }
}