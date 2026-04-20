import React, { useState, type FormEvent, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simple AI response
    setTimeout(() => {
      const responses = [
        "Hello! Admin login is at /login",
        "Dashboard /dashboard (protected)",
        "Chat is default / route",
        "UI simplified - no hover effects",
        "Backend API ready",
        "Fully responsive now"
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  return (
    <div className="vh-100 d-flex flex-column bg-dark text-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary p-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            CS Chat
          </span>
          <span className="badge bg-success">Live</span>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        <div className="d-flex flex-column h-100 justify-content-end">
          {messages.length === 0 ? (
            <div className="text-center opacity-75 mt-5">
              <h4>Start chatting!</h4>
              <p className="lead">Type a message below</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`mb-2 ${message.isUser ? 'align-self-end' : 'align-self-start'}`}>
                <div className={`p-3 rounded-3 shadow-sm ${message.isUser ? 'bg-primary' : 'bg-secondary'}`}>
                  <div className="small mb-1 opacity-75">
                    {message.isUser ? 'You' : 'Bot'}
                  </div>
                  <div>{message.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} className="p-3 bg-secondary">
        <div className="container">
          <div className="row g-2">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary px-4">
                Send
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatHome;

