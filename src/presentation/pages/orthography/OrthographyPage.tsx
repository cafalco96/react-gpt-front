import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
  GptOrthographyMessage,
} from "../../components";
import { useState } from "react";
import { orthographyUseCase } from "../../../core/use-cases";
interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errores: string[];
    message: string;
  };
}
export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const { ok, userScore, errores, message } = await orthographyUseCase(text);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, ha ocurrido un error al corregir el texto.",
          isGpt: true,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `Tu texto tiene una puntuación de ${userScore}. ${message}`,
          isGpt: true,
          info: {
            userScore,
            errores,
            message,
          },
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
          <GptMessage text="Hola, puedes escribir algo en español y te ayudaré" />
          {/* Ejemplo de mensaje del usuario */}
          {messages.map((message, index) =>
            message.isGpt ? (
              message.info ? (
                <GptOrthographyMessage key={index} {...message.info} />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
            ) : (
              <MyMessage key={index} text={message.text} />
            ),
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
