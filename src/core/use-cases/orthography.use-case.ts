import type { OrthographyResponse } from "../../interfaces";

export const orthographyUseCase = async (prompt: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Error al corregir el texto");
    const data = await res.json() as OrthographyResponse;
    return {
      ok: true,
      ...data,
    }
  } catch (error) {
    return {
      userScore: 0,
      ok: false,
      errores: [],
      message: "Error al corregir el texto"
    }
  }
}