import React, { createContext, useState, useEffect } from 'react';

// Create a new context
export const WebSocketContext = createContext();

// Create a provider component
export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    // Create a new WebSocket connection
    const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onmessage = (event) => {
      // The data is stored in the event object
      console.log('Received data:', event.data);
    };

    // Save the WebSocket object in the state
    setWebSocket(ws);

    // Close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};