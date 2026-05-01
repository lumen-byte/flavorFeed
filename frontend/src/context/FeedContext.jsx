import React, { createContext, useState, useContext } from 'react';

const FeedContext = createContext();

export const useFeed = () => useContext(FeedContext);

export const FeedProvider = ({ children }) => {
    const [feedType, setFeedType] = useState('all'); // 'all' or 'nearby'

    return (
        <FeedContext.Provider value={{ feedType, setFeedType }}>
            {children}
        </FeedContext.Provider>
    );
};
