import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './index.css';
import { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const App = () => {

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Bienvenido al chat de <b>Sebas - A.I</b>. Soy una inteligencia artificial y mi intension es ayudarte con cada una de tus preguntas, es un placer saludarte, ¿En que puedo ayudarte hoy?",
      sender: "SebasBot"
    }
  ])
const handleSend = async (message) => {
  const newMessage = {
    message: message,
    sender: "User",
    direction: "outgoing"
  }
  const newMessages = [...messages, newMessage];
  setMessages(newMessages)

  setTyping(true)

  await processMessageToChat(newMessages);
}

async function processMessageToChat(chatMessages){

let apiMessages = chatMessages.map((messageObject) => {
  let role = "";
  if (messageObject.sender === "SebasBot") {
    role = "assistant"
  } else {
    role = "user"
  }
  return {role: role, content: messageObject.message}
});

const systemMessage = {
  role: "system",
  content: "Necesito que entiendas el lenguaje natural y coloquial que se te provee"
}

const apiRequestBody = {
  "model": "gpt-3.5-turbo",
  "messages": [
    systemMessage,
    ...apiMessages
  ]
}

await fetch("https://api.openai.com/v1/chat/completions",{
  method: "POST",
  headers: {
    "Authorization": "Bearer " + process.env.REACT_APP_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(apiRequestBody)
}).then((data) => {
  return data.json()
}).then((data) => {
  console.log(data)
  setMessages(
    [...chatMessages, {
      message: data.choices[0].message.content,
      sender: "SebasBot"
    }]
  )
  setTyping(false);
})

}

  return (
  <div className="App">

      <div className='container'>
        <div className='info'>
          <div className='info_logo'></div>
          <h1>Sebas - A.I</h1>
          <div className='info_documentation'>
          <a href='https://www.openai.com'> <i className="fa-regular fa-file" /> <br /> <span>Doc. API</span></a>
            <br />
          <a href='https://www.linkedin.com/in/sebastiandevv'> <i className="fa-brands fa-linkedin" /> <br /> <span>LinkedIn</span></a>
            <br />
          <a href='mailto:sruizramirez11@gmail.com'> <i className="fa-regular fa-envelope" /> <br /> <span>E-mail</span></a>
          </div>
        </div>

        <MainContainer style={{width: "75%"}}>
          <ChatContainer >
            <MessageList
            scrollBehavior='smooth'
            typingIndicator={typing ? <TypingIndicator content="SebasAI esta escribiendo..." /> : null}
            style={{paddingBottom:"20px"}}
            >
              {
                messages.map((message,i) =>{
                  return <Message key={i} model={message} style={{ width: "100%", height: "auto", padding: "0px"}}/>
                })
              }
            </MessageList >
            <MessageInput placeholder='Mensaje' onSend={handleSend} style={{ position: "fixed", bottom: "10px", width:"70%"}}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
