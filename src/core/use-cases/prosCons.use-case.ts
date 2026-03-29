import type { ProsConsResponse } from "../../interfaces";

export const ProsConsUseCase = async (prompt: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );
    if (!res.ok) throw new Error("Error al comparar");
    const data = await res.json() as ProsConsResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      role: "assistant",
      content: "Error al comparar",
      refusal: null,
      annotations: [],
      ok: false
    };
  }
};
