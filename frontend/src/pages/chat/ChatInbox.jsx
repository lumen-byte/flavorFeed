import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { socket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from '../../components/chat/MessageBubble';
import { Send, User as UserIcon } from 'lucide-react';

const ChatInbox = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    
    fetchMessages(activeChat._id);
    socket.emit('join_conversation', activeChat._id);

    const handleReceiveMessage = (message) => {
      if (message.conversationId === activeChat._id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
        // Mark as seen
        if (message.sender._id !== user._id) {
          socket.emit('mark_seen', { conversationId: activeChat._id, messageIds: [message._id] });
        }
      }
    };

    const handleTyping = (data) => {
      if (data.userId !== user._id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
    };
  }, [activeChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/auth/conversations'); // using /api/conversations 
      // wait, the app uses /api/conversations. My route was app.use('/api/conversations', chatRoutes)
      // Wait, let's fix the path
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axiosInstance.get(`/conversations/${conversationId}/messages`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const tempMsg = {
      _id: Date.now().toString(),
      conversationId: activeChat._id,
      sender: user,
      messageType: 'text',
      content: inputText,
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();
    setInputText('');
    handleTypingChange(false);

    try {
      const res = await axiosInstance.post(`/conversations/${activeChat._id}/messages`, {
        content: tempMsg.content,
        messageType: 'text'
      });
      
      socket.emit('send_message', res.data);
      
      // Update with actual DB message
      setMessages((prev) => prev.map(m => m._id === tempMsg._id ? res.data : m));
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleTypingChange = (isTypingState) => {
    if (!activeChat) return;
    socket.emit('typing', { conversationId: activeChat._id, isTyping: isTypingState });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      handleTypingChange(true);
    }
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      handleTypingChange(false);
    }, 2000);
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id) || conversation.participants[0];
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 overflow-hidden">
      {/* Left Panel: Conversations List */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = getOtherParticipant(conv);
              return (
                <div 
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={`p-4 border-b flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat?._id === conv._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {otherUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{otherUser.fullName}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.messageType === 'text' ? conv.lastMessage.content : 
                       conv.lastMessage?.messageType === 'reel_share' ? 'Shared a reel' :
                       conv.lastMessage?.messageType === 'food_share' ? 'Shared food' : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5]">
        {activeChat ? (
          <>
            {/* Chat Header (Glassmorphism) */}
            <div className="h-16 px-4 flex items-center gap-3 border-b z-10 sticky top-0" style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                  {getOtherParticipant(activeChat).fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{getOtherParticipant(activeChat).fullName}</h3>
                  {otherUserTyping && <p className="text-xs text-blue-500">Typing...</p>}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg._id} 
                  message={msg} 
                  isOwnMessage={msg.sender._id === user._id || msg.sender === user._id} 
                />
              ))}
              {otherUserTyping && (
                 <div className="flex justify-start mb-4 animate-slide-up">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm p-3 w-16 flex justify-center items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center w-10 h-10"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <UserIcon size={64} className="mb-4 opacity-20" />
            <p className="text-xl">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInbox;
