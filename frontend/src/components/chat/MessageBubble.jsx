import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/MessageBubble.css';

const MessageBubble = memo(({ message, isOwnMessage }) => {
  const navigate = useNavigate();

  return (
    <div className={`msg-row ${isOwnMessage ? 'own' : 'other'}`}>
      <div className={`msg-bubble ${isOwnMessage ? 'own' : 'other'}`}>

        {message.messageType === 'text' && (
          <p>{message.content}</p>
        )}

        {message.messageType === 'reel_share' && message.sharedReel && (
          <div>
            <p className="msg-share-label">Shared a Reel</p>
            <div className="msg-share-card">
              <img
                src={message.sharedReel.videoUrl}
                alt="Reel Thumbnail"
                className="msg-share-img"
              />
              <div className="msg-share-body">
                <p className="msg-share-title">{message.sharedReel.description}</p>
                <button
                  className="msg-share-btn"
                  onClick={() => navigate('/reels')}
                >
                  View Reel
                </button>
              </div>
            </div>
          </div>
        )}

        {message.messageType === 'food_share' && message.sharedFood && (
          <div>
            <p className="msg-share-label">Shared Food</p>
            <div className="msg-share-card">
              <img
                src={message.sharedFood.image}
                alt="Food"
                className="msg-share-img"
              />
              <div className="msg-share-body">
                <p className="msg-share-title">{message.sharedFood.name}</p>
                <p className="msg-share-price">₹{message.sharedFood.price}</p>
                <button
                  className="msg-share-btn"
                  onClick={() => navigate(`/restaurant/${message.sharedFood.foodPartner}`)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="msg-meta">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {isOwnMessage && (
            <span>{message.seenBy?.length > 1 ? '✓✓' : '✓'}</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;
