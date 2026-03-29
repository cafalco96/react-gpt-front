import React from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { useState } from "react";
import { ProsConsUseCase } from "../../../core/use-cases";
interface Message {
  text: string;
  isGpt: boolean;
}
export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const { ok, content, role } = await ProsConsUseCase(text);
    setIsLoading(false);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, ha ocurrido un error al comparar.",
          isGpt: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `${content}`,
          isGpt: true,
        },
      ]);
    }
    //TODO Añadir mensaje de GPT con la corrección
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, escribe lo que deseas comparar..." />
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
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Expon tu comparación..."
        disabledCorrections
      />
    </div>
  );
};
