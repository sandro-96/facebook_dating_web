import React, {useEffect, useRef, createContext, useContext, useState} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {Slide, toast} from 'react-toastify';
import {useLocation, useNavigate} from "react-router-dom";

const defaultWebSocketContext = {};
export const WebSocketContext = createContext(defaultWebSocketContext);
export const WebSocketComponent = (props) => {
  const clientRef = useRef(null);
  const {userData, setUserLikedCount, userLikedCount, setLastPublicMessage } = useContext(UserContext);
  const [messageWs, setMessageWs] = useState(null);

  useEffect(() => {
    if (!userData) return; // Don't run the effect if userData is not set

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client();

    client.webSocketFactory = () => {
      return socket;
    };

    // Use the functions in the onConnect callback
    client.onConnect = () => {
      client.subscribe('/queue/messages', (message) => {
        const messageBody = JSON.parse(message.body);
        console.log('Received message:', messageBody);
        if (messageBody?.forUserId === userData.id) {
          setMessageWs(messageBody);
          if (messageBody.type === Constant.SOCKET.SOCKET_MATCH_UPDATE) setUserLikedCount(userLikedCount + 1);
        } else if (messageBody.type === Constant.SOCKET.SOCKET_PUBLIC_CHAT_NEW_MESSAGE) {
          setMessageWs(messageBody);
          setLastPublicMessage(messageBody.data.content);
        }
        if (messageBody.type === Constant.SOCKET.SOCKET_CHAT_EMOJI) {
          const newMessageWs = messageBody.data
          newMessageWs.type = Constant.SOCKET.SOCKET_CHAT_EMOJI;
          setMessageWs(newMessageWs);
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
  }, [userData]); // Add userData as a dependency

  return (
      <WebSocketContext.Provider value={{messageWs, setMessageWs}}>
        <div>
          {props.children}
        </div>
      </WebSocketContext.Provider>
  );
};

export default WebSocketComponent;