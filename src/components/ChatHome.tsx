import React, { useState, type FormEvent, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  userName: string;
}

interface User {
  name: string;
  email: string;
}

const ChatHome: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleEnterChat = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setShowChat(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      userName: user.name,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const responses = [
        `Hi ${user.name}! Admin login ready.`,
        "Use /login for admin panel.",
        `/dashboard shows profile.`,
        "Chat unlocked with your details.",
        "Backend API live.",
        "Simple and responsive."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        userName: 'CS Bot',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  if (!showChat || !user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="card shadow-lg" style={{width: '400px'}}>
          <div className="card-body p-5 text-center">
            <form onSubmit={handleEnterChat}>
              <div className="mb-4">
                <label className="form-label fw-bold mb-2 d-block">Name</label>
                <input
                  type="text"
                  className="form-control form-lg"
                  placeholder="Your name"
                  onChange={(e) => setUser(prev => prev ? {...prev, name: e.target.value} : {name: e.target.value, email: ''})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold mb-2 d-block">Email</label>
                <input
                  type="email"
                  className="form-control form-lg"
                  placeholder="your@email.com"
                  onChange={(e) => setUser(prev => prev ? {...prev, email: e.target.value} : {name: '', email: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100">
                Enter Chat
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex flex-column bg-dark text-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary p-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            Welcome {user.name}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={() => setShowChat(false)}>
            Leave
          </button>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        <div className="d-flex flex-column h-100 justify-content-end">
          {messages.map((message) => (
            <div key={message.id} className={`mb-2 ${message.isUser ? 'align-self-end' : 'align-self-start'}`}>
              <div className={`p-3 rounded-3 shadow-sm ${message.isUser ? 'bg-primary text-white' : 'bg-secondary text-light'}`}>
                <div className="small mb-1 opacity-75">
                  {message.userName}
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}
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
                placeholder={`Message as ${user.name}...`}
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

