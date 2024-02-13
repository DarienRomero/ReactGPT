import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from "../../components";
import { audioToTextUseCase } from "../../../core/usecases/audio-to-text.use-case";


interface Message {
  text: string;
  isGpt: boolean;

}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, {text: text, isGpt: false}]);
    const resp = await audioToTextUseCase(audioFile, text)
    setIsLoading(false);
    if(!resp) return;//No hay respuesta
    const gptMessage = `
      ##Transcripción:
      __Duración:__ ${Math.round(resp.duration)}
      ### El texto fue
      ${resp.text}

    `
    setMessages((prev) => [
      ...prev,
      {
        text: gptMessage,
        isGpt: true
      }
    ])
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/* Bienvenido */}
          <GptMessage text="Hola, puedes escribir subir tu archivo y te muestro las traducciones"/>
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
      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder = 'Escribe aquí lo que deseas'
        disableCorrections
        accept="audio/*"
      />
    </div>
  )
}
