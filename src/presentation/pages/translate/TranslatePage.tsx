import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { translateUseCase } from "../../../core/usecases";


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
    setMessages((prev) => [...prev, {text: text, isGpt: false}]);
    const data = await translateUseCase(text, selectedOption);
    if(!data.ok){
      setMessages((prev) => [...prev, {text: "No se pudo realizar la corrección", isGpt: true}]);
    }else{
      setMessages((prev) => [...prev, {text: data.content, isGpt: true}]);
    }
    console.log({data});
    setIsLoading(false);
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenido */}
          <GptMessage text="Qué quieres que traduzca hoy?"/>
          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptMessage key={index} text={message.text}/>
              ) : (
                <MyMessage key={index} text ={message.text}/>
              )
            )) 
          }
          {isLoading && <div className="col-start-1 col-end-12 fade-in">
            <TypingLoader className="fade-in"/>
          </div>}
        </div>
      </div>
      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder = 'Escribe aquí lo que deseas'
        options={languages}
      />
    </div>
  )
}
