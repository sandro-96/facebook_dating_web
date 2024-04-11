import React, { useEffect, useRef, createContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


const defaultWebSocketContext = {};
export const WebSocketContext = createContext(defaultWebSocketContext);
export const WebSocketComponent = (props) => {
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client();

    client.webSocketFactory = () => {
      return socket;
    };

    client.onConnect = (frame) => {
      client.subscribe('/queue/messages', (message) => {
        if (message.body) {
          console.log("Received message: ", JSON.parse(message.body));
        }
      });
    };

    client.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.connected) {
        client.deactivate().then(r => console.log('Deactivated'));
      }
    };
  }, []);

  return (
      <div>
        {props.children}
      </div>
  );
};

export default WebSocketComponent;