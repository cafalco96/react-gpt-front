import React from "react";
import {
  GptMessage,
  GptMessageAudio,
  MyMessage,
  TextMessageBox,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { useState } from "react";
import { textToAudioUseCase } from "../../../core/use-cases";
interface TextMessage {
  text: string;
  isGpt: boolean;
  type: "text";
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: "audio";
}

type Message = TextMessage | AudioMessage;
export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const disclaimer = `# Hola, que audio quieres que genere?
  * Todo el audio generado es completamente ficticio y no representa a ninguna persona real.
  * El audio generado es solo para fines de entretenimiento y no debe ser utilizado para ningún propósito ilegal o dañino.
  * OpenAI no se hace responsable de cualquier uso indebido del audio generado.
  `
  const voices = [
    { id: 'alloy', text: 'Alloy' },
    { id: 'nova', text: 'Nova' },
    { id: 'coral', text: 'Coral' },
    { id: 'ash', text: 'Ash' },
    { id: 'ballad', text: 'Ballad' },
    { id: 'echo', text: 'Echo' },
    { id: 'fable', text: 'Fable' }
  ]
  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false, type: "text" }]);
    //TODO UseCase
    const { ok, audioUrl, message } = await textToAudioUseCase(text, selectedVoice);
    setIsLoading(false);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, ha ocurrido un error al generar el audio.",
          isGpt: true,
          type: "text"
        },
      ]);
    }
    else {
      setMessages((prev) => [
        ...prev,
        {
          text: `${selectedVoice} - ${message}`,
          isGpt: true,
          audio: audioUrl,
          type: "audio"
        } as AudioMessage,
      ]);
    }

    //TODO Añadir mensaje de GPT con la corrección
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text={disclaimer} />
          {/* Ejemplo de mensaje del usuario */}
          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audioUrl={(message as AudioMessage).audio}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}
          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe lo que deseas corregir..."
        options={voices}
      />
    </div>
  );
};

