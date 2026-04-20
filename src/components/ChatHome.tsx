import React, { useState, type FormEvent, useRef, useEffect } from 'react';
import { addClient, getClientId } from '../services/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  userName: string;
  clientId: string;
}

interface User {
  name: string;
  email: string;
  clientId: string;
}

const ChatHome: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const handleEnterChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.name || !user.email || isLoading) return;
    
    setIsLoading(true);
    try {
      let clientId: string;
      try {
        await addClient(user.name, user.email);
        const getRes = await getClientId(user.email);
        clientId = getRes.clientId;
      } catch (addError: any) {
        if (addError.response?.data?.error === 'Email already registered') {
          setToastMsg('Email already registered. Please use a different email.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          return; // Stay on form
        } else {
          throw addError;
        }
      }
      setUser({ ...user, clientId });
      localStorage.setItem('chatUser', JSON.stringify({ ...user, clientId }));
      setShowChat(true);
    } catch (error: any) {
      console.error('Client setup failed:', error);
    } finally {
      setIsLoading(false);
    }
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
      clientId: user.clientId,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
        const responses = [
        `Hi ${user.name} (${user.clientId})! Welcome.`,
        "Admin login at /login → /dashboard.",
        "Your client registered successfully.",
        "Chat persistent per session."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        userName: 'CS Bot',
        clientId: '',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  if (!showChat || !user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark position-relative">
        <div className="card shadow" style={{maxWidth: '450px', width: '100%'}}>
          <div className="card-body p-5 text-center">
            <h2 className="card-title text-primary mb-4">Enter Chat Room</h2>
            <form onSubmit={handleEnterChat}>
              <div className="mb-3">
                <label className="form-label fw-bold mb-2 d-block text-start">Full Name</label>
                <input
                  type="text"
                  className="form-control form-lg"
                  placeholder="Enter your name"
                  value={user?.name || ''}
                  onChange={(e) => setUser({name: e.target.value, email: user?.email || '', clientId: ''})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold mb-2 d-block text-start">Email</label>
                <input
                  type="email"
                  className="form-control form-lg"
                  placeholder="your@email.com"
                  value={user?.email || ''}
                  onChange={(e) => setUser({name: user?.name || '', email: e.target.value, clientId: ''})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 py-3" disabled={isLoading}>
                <i className="bi bi-chat-dots me-2"></i>
                {isLoading ? 'Connecting...' : 'Enter Chat Room'}
              </button>
            </form>
            <p className="mt-3 text-muted small">
              Client ID auto-generated on backend
            </p>
          </div>
        </div>
        {showToast && (
          <div className="position-absolute top-0 end-0 m-3 translate-middle-y-start" style={{zIndex: 1060}}>
            <div className="alert alert-warning alert-dismissible fade show shadow" role="alert">
              {toastMsg}
              <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Close"></button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex flex-column bg-dark text-light">
      {/* Header */}
      <div className="bg-primary p-3 border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.name}</strong> <small className="opacity-75">({user.clientId})</small>
            </div>
            <button className="btn btn-outline-light btn-sm" type="button" onClick={() => {
              setShowChat(false);
              setUser(null);
              setMessages([]);
            }}>
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-4 bg-black">
        <div className="d-flex flex-column h-100 justify-content-end">
          {messages.map((message) => (
            <div key={message.id} className={`mb-2 ${message.isUser ? 'align-self-end' : 'align-self-start'}`}>
              <div className={`p-3 rounded-3 ${message.isUser ? 'bg-primary text-white' : 'bg-secondary'}`}>
                <div className="small fw-bold mb-1">
                  {message.userName}{message.clientId && !message.isUser ? '' : ` (${message.clientId})`}
                </div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} className="p-3 border-top bg-black">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-secondary text-light border-end-0"
            placeholder={`Message as ${user.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatHome;

