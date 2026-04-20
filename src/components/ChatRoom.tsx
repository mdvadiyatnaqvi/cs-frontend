import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

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

const ChatRoom: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (!storedUser) {
      navigate('/');
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser) as User;
      if (!parsedUser.name || !parsedUser.email || !parsedUser.clientId) {
        localStorage.removeItem('chatUser');
        navigate('/');
        return;
      }
      setUser(parsedUser);
      // Restore messages if needed (for now empty)
    } catch (error) {
      console.error('Invalid stored user:', error);
      localStorage.removeItem('chatUser');
      navigate('/');
    }
  }, [navigate]);

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

  const handleLeave = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
    setMessages([]);
    navigate('/');
  };

  if (!user) {
    return <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light">Loading...</div>;
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
            <button className="btn btn-outline-light btn-sm" type="button" onClick={handleLeave}>
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
                  {message.userName} {message.clientId && !message.isUser ? '' : `(${message.clientId})`}
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

export default ChatRoom;

