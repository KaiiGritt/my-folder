import { createContext, useContext, useState, useEffect } from 'react';

const MyListContext = createContext();

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem('cinestream-my-list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading my list from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever myList changes
  useEffect(() => {
    localStorage.setItem('cinestream-my-list', JSON.stringify(myList));
  }, [myList]);

  const addToList = (item) => {
    setMyList(prev => {
      // Check if item already exists
      const exists = prev.some(listItem => listItem.id === item.id && listItem.media_type === item.media_type);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromList = (itemId, mediaType) => {
    setMyList(prev => prev.filter(item => !(item.id === itemId && item.media_type === mediaType)));
  };

  const isInList = (itemId, mediaType) => {
    return myList.some(item => item.id === itemId && item.media_type === mediaType);
  };

  const value = {
    myList,
    addToList,
    removeFromList,
    isInList,
  };

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
};
