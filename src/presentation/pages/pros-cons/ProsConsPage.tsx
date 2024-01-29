import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsUseCase } from '../../../core/usecases/';


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, {text: text, isGpt: false}]);
    const data = await prosConsUseCase(text);
    if(!data.ok){
      setMessages((prev) => [...prev, {text: "No se pudo realizar la corrección", isGpt: true}]);
    }else{
      setMessages((prev) => [...prev, {text: data.content || '', isGpt: true}]);
    }
    console.log({data});
    setIsLoading(false);
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
                <GptMessage 
                  key={index} 
                  text={message.text}
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
