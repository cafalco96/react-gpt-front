import React from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../components";
import { useState } from "react";
interface Message {
  text: string;
  isGpt: boolean;
}
export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    //TODO UseCase
    setIsLoading(false);
    //TODO Añadir mensaje de GPT con la corrección
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir algo en español y te ayudaré a corregir la ortografía." />
          {/* Ejemplo de mensaje del usuario */}
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text="Cosas de OpenAI" />
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
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe lo que deseas corregir..."
        disabledCorrections
      />
    </div>
  );
};
