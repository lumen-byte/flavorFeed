import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const MessageBubble = memo(({ message, isOwnMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      <div 
        className={`max-w-[70%] rounded-2xl p-3 ${
          isOwnMessage ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
        style={{
          animation: 'slideUp 0.3s ease-out forwards'
        }}
      >
        {message.messageType === 'text' && (
          <p className="text-sm">{message.content}</p>
        )}

        {message.messageType === 'reel_share' && message.sharedReel && (
          <div className="flex flex-col gap-2">
            <div className="text-xs opacity-80 italic mb-1">Shared a Reel</div>
            <div className="bg-white rounded overflow-hidden text-black w-48">
              <img 
                src={message.sharedReel.videoUrl} 
                alt="Reel Thumbnail" 
                className="w-full h-32 object-cover bg-gray-200" 
              />
              <div className="p-2">
                <p className="text-xs font-semibold truncate">{message.sharedReel.description}</p>
                <button 
                  onClick={() => navigate(`/reels`)}
                  className="mt-2 w-full bg-blue-500 text-white text-xs py-1 rounded hover:bg-blue-600"
                >
                  View Reel
                </button>
              </div>
            </div>
          </div>
        )}

        {message.messageType === 'food_share' && message.sharedFood && (
          <div className="flex flex-col gap-2">
            <div className="text-xs opacity-80 italic mb-1">Shared Food</div>
            <div className="bg-white rounded overflow-hidden text-black w-48">
              <img 
                src={message.sharedFood.image} 
                alt="Food" 
                className="w-full h-32 object-cover bg-gray-200" 
              />
              <div className="p-2">
                <p className="text-xs font-semibold truncate">{message.sharedFood.name}</p>
                <p className="text-xs font-bold mt-1">₹{message.sharedFood.price}</p>
                <button 
                  onClick={() => navigate(`/restaurant/${message.sharedFood.foodPartner}`)}
                  className="mt-2 w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-[10px] opacity-70 mt-1 flex justify-end items-center gap-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isOwnMessage && (
            <span className="text-[10px] ml-1">
              {message.seenBy?.length > 1 ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

export default MessageBubble;
