import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { socket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from '../../components/chat/MessageBubble';
import { Send, User as UserIcon } from 'lucide-react';
import '../../styles/ChatInbox.css';

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
        if (message.sender._id !== user._id) {
          socket.emit('mark_seen', { conversationId: activeChat._id, messageIds: [message._id] });
        }
      }
    };

    const handleTyping = (data) => {
      if (data.userId !== user._id) setOtherUserTyping(data.isTyping);
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
      const res = await axiosInstance.get('/auth/conversations');
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
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();
    setInputText('');
    handleTypingChange(false);

    try {
      const res = await axiosInstance.post(`/conversations/${activeChat._id}/messages`, {
        content: tempMsg.content,
        messageType: 'text',
      });
      socket.emit('send_message', res.data);
      setMessages((prev) => prev.map((m) => (m._id === tempMsg._id ? res.data : m)));
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

  const getOtherParticipant = (conversation) =>
    conversation.participants.find((p) => p._id !== user._id) || conversation.participants[0];

  return (
    <div className={`chat-layout${activeChat ? ' has-active' : ''}`}>
      {/* ── Left Sidebar ── */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
        </div>

        <div className="chat-conversations">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="chat-skeleton-item">
                <div className="skeleton chat-skeleton-avatar" />
                <div className="chat-skeleton-lines">
                  <div className="skeleton chat-skeleton-line short" />
                  <div className="skeleton chat-skeleton-line long" />
                </div>
              </div>
            ))
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={`conversation-item${activeChat?._id === conv._id ? ' active' : ''}`}
                >
                  <div className="conv-avatar">{other.fullName.charAt(0).toUpperCase()}</div>
                  <div className="conv-info">
                    <h3>{other.fullName}</h3>
                    <p>
                      {conv.lastMessage?.messageType === 'text'
                        ? conv.lastMessage.content
                        : conv.lastMessage?.messageType === 'reel_share'
                        ? 'Shared a reel'
                        : conv.lastMessage?.messageType === 'food_share'
                        ? 'Shared food'
                        : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="chat-main">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-avatar">
                {getOtherParticipant(activeChat).fullName.charAt(0).toUpperCase()}
              </div>
              <div className="chat-header-info">
                <h3>{getOtherParticipant(activeChat).fullName}</h3>
                {otherUserTyping && (
                  <p className="chat-typing-indicator">Typing…</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwnMessage={msg.sender._id === user._id || msg.sender === user._id}
                />
              ))}

              {otherUserTyping && (
                <div className="typing-bubble">
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type a message…"
                  className="chat-text-input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="chat-send-btn"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <UserIcon size={64} className="chat-empty-icon" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInbox;
