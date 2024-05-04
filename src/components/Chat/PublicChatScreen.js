import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Constant from "../Utils/Constant";
import {UserContext} from "../Context/UserContext";
import MessageDate from "./MessageDate";

export const PublicChatScreen = () => {
    const { messageWs } = useContext(WebSocketContext);
    const { userData } = useContext(UserContext);
    const { state } = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        loadMessages(page);
    }, []);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);
    useEffect(() => {
        if (messageWs &&
            messageWs.type === Constant.SOCKET.SOCKET_PUBLIC_CHAT_NEW_MESSAGE
            && messageWs.data.createdBy !== userData.id
        ) {
            setMessages([...messages, messageWs.data]);
        }
    }, [messageWs]);
    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const loadMessages = async (page) => {
        try {
            const response = await axios.get(`chat/public?page=${page}&size=20`);
            if (response && response.data) {
                setMessages(oldMessages => [...response.data.content.reverse(), ...oldMessages]);
                setTotalPage(response.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }
    const handleScroll = (e) => {
        const { scrollTop} = e.currentTarget;
        if (scrollTop === 0) { // top of the chat
            if (page < totalPage - 1) {
                setPage(page + 1); // increment page number
                loadMessages(page + 1);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' && !isSending) {
            setIsSending(true);
            try {
                const formData = new FormData();
                formData.append('content', newMessage);
                const response = await axios.post(`/chat/public/send`, formData);
                if (response) {
                    setNewMessage('');
                    setMessages([...messages, response.data]);
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    const getRandomColor = () => {
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = Math.floor(Math.random() * 128) + 128; // Generate a number between 128 and 255
            const part = value.toString(16); // Convert the number to a hexadecimal string
            color += part.length < 2 ? '0' + part : part;
        }
        return color;
    };

    return (
        <div className="chat-screen-wrap">
            <div className="top-bar">
                <div className="name-wrap">
                    Kênh chat chung
                </div>
            </div>
            <div className="content-wrap" onScroll={handleScroll}>
                {messages.map((message, index) => (
                    <div className="d-flex flex-column" key={index}>
                        <MessageDate index={index} messages={messages} />
                        <div key={index}
                             className={`message-item ${message.createdBy === userData.id ? 'right' : 'left'}`}
                             ref={index === messages.length - 1 ? messagesEndRef : null}>
                            {
                                message.createdBy !== userData.id &&
                                <Avatar imgKey={message.userInfo.avatar} genderKey={message.userInfo.gender}
                                        sizeKey={30}/>
                            }
                            <div className="message-content">
                                {message.createdBy !== userData.id &&
                                    <div style={{color: getRandomColor()}}>{message.userInfo.username}</div>
                                }
                                <span>{message.content}</span>
                                <span className="time">{DateUtils.formatTime(message.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="send-message-wrap stick-to-bottom">
                <input
                    className="form-control"
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x"
                                 style={{color: "#74C0FC"}} disabled={isSending}/>
            </div>
        </div>
    );
};

export default PublicChatScreen;