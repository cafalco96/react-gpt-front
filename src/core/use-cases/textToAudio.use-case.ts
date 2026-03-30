
export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, voice })
    });
    if (!res.ok) throw new Error("Error al generar el audio");
    const audioFile = await res.blob();
    const audioUrl = URL.createObjectURL(audioFile);
    return {
      ok: true,
      audioUrl,
      message: prompt
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error al generar el audio"
    }
  }
}