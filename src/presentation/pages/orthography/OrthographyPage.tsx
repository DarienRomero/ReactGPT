import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/usecases";
import { GptOrthographyMessage } from "../../components/chat-bubbles/GptOrthographyMessage";


interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, {text: text, isGpt: false}]);
    const data = await orthographyUseCase(text);
    if(!data.ok){
      setMessages((prev) => [...prev, {text: "No se pudo realizar la corrección", isGpt: true}]);
    }else{
      setMessages((prev) => [...prev, {text: data.message, isGpt: true, info: {
        errors: data.errors,
        message: data.message,
        userScore: data.userScore!
      }}]);
    }
    console.log({data});
    setIsLoading(false);
    //TODO: Añadir el mensaje de isGPT en true
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenido */}
          <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones"/>
          {
            messages.map((message, index) => (
              message.isGpt ? (
                <GptOrthographyMessage 
                  key={index} 
                  errors={message.info!.errors}
                  message = {message.info!.message}
                  userScore={message.info!.userScore}
                />
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
      <TextMessageBox 
        onSendMessage={handlePost}
        placeholder = 'Escribe aquí lo que deseas'
        disableCorrections
      />
      {/* {<TextMessageBoxFile 
        onSendMessage={handlePost}
        placeholder = 'Escribe aquí lo que deseas'
        disableCorrections
      />} */}
      {/* {<TextMessageBoxSelect 
        onSendMessage={handlePost}
        placeholder = 'Escribe aquí lo que deseas'
        disableCorrections
        options={[
          {id: "1", text: 'Hola'},{id: "2", text: 'Mundo'}
        ]}
      />} */}
    </div>
  )
}
