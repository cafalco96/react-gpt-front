import React from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { useState } from "react";
import { translateUseCase } from "../../../core/use-cases";
interface Message {
  text: string;
  isGpt: boolean;
}
const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];
export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);
    const newMessage = `Traduce el siguiente texto al ${selectedOption.toLocaleUpperCase()}: ${text}`;
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);
    //TODO UseCase
    const { ok, message } = await translateUseCase(text, selectedOption);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, ha ocurrido un error al traducir el texto.",
          isGpt: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: true,
        },
      ]);
    }
    setIsLoading(false);
    //TODO Añadir mensaje de GPT con la corrección
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes traducir tu texto a otro idioma." />
          {/* Ejemplo de mensaje del usuario */}
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
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
        placeholder="Escribe lo que deseas traducir..."
        options={languages}
      />
    </div>
  );
};
