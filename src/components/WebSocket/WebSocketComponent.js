import React, {useEffect, useRef, createContext, useContext, useState} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {Slide, toast} from 'react-toastify';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const defaultWebSocketContext = {};
export const WebSocketContext = createContext(defaultWebSocketContext);
export const WebSocketComponent = (props) => {
  const clientRef = useRef(null);
  const {userData } = useContext(UserContext);
  const [messageWs, setMessageWs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return; // Don't run the effect if userData is not set

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client();

    client.webSocketFactory = () => {
      return socket;
    };

    // Function to show toast notification
    const showToastNotification = (message, data) => {
      data.topicId &&
      toast(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,/*
        onClick: () => {
          axios.get(`fbd_users/${data.createdBy}`).then((res) => {
            navigate(`/chat/${data.topicId}?isHideNavBar=true`, { state: {topicId: data.topicId, userInfo: res.data} });
          })
        }*/
      });
    };

// Function to show desktop notification
    const showDesktopNotification = (message) => {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            new Notification(message);
          }
        });
      }
    };

// Use the functions in the onConnect callback
    // Function to handle topic update
    const handleTopicUpdate = (messageBody) => {
      const toastMessage = 'Bạn có đoạn chat mới!';
      showToastNotification(toastMessage, messageBody);
    };

// Function to handle chat update
    const handleChatUpdate = (messageBody) => {
      showToastNotification(messageBody.content, messageBody);
      showDesktopNotification(messageBody.content);
    };

// Function to handle topic delete
    const handleTopicDelete = (messageBody) => {
      // No action needed for topic delete
    };

// Use the functions in the onConnect callback
    client.onConnect = () => {
      client.subscribe('/queue/messages', (message) => {
        const messageBody = JSON.parse(message.body);
        console.log(messageBody)
        if (messageBody?.forUserId === userData.id) {
          setMessageWs(messageBody);
          switch (messageBody.type) {
            case Constant.SOCKET.SOCKET_TOPIC_UPDATE:
              handleTopicUpdate(messageBody);
              break;
            case Constant.SOCKET.SOCKET_CHAT_UPDATE:
              handleChatUpdate(messageBody);
              break;
            case Constant.SOCKET.SOCKET_TOPIC_DELETE:
              handleTopicDelete(messageBody);
              break;
            default:
              console.log('Unknown message type:', messageBody.type);
          }
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