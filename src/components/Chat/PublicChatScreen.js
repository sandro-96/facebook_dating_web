import React, {useState, useEffect, useRef, createContext, useContext} from 'react';
import axios from 'axios';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faPaperPlane,
    faBars,
    faArrowRightFromBracket,
    faArrowLeft,
    faImage
} from "@fortawesome/free-solid-svg-icons";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {Popper} from "@mui/material";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Constant from "../Utils/Constant";
import {UserContext} from "../Context/UserContext";

export const PublicChatScreen = () => {
    const { messageWs } = useContext(WebSocketContext);
    const { userData } = useContext(UserContext);
    const { state } = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadMessages();
    }, []);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    useEffect(() => {
        if (messageWs && messageWs.topicId === state.topicId) {
            setMessages([...messages, messageWs]);
        }
    }, [messageWs]);
    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const loadMessages = async () => {
        try {
            const response = await axios.get(`chat/public`);
            response && setMessages(response.data.content);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
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
            }
        }
    };

    return (
        <div className="chat-screen-wrap">
            <div className="top-bar">
                <div className="name-wrap">
                    Kênh chat chung
                </div>
            </div>
            <div className="content-wrap">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`message-item ${message.createdBy === userData.id ? 'right' : 'left'}`}
                         ref={index === messages.length - 1 ? messagesEndRef : null}>
                        {
                            message.createdBy !== userData.id &&
                            <Avatar imgKey={message.userInfo.avatar} genderKey={message.userInfo.gender} sizeKey={30}/>
                        }
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="send-message-wrap stick-to-bottom">
                <label htmlFor="file-upload">
                    <FontAwesomeIcon icon={faImage} size="2x" style={{color: "#74C0FC"}}/>
                </label>
                <input
                    className="form-control"
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x"
                                 style={{color: "#74C0FC"}}/>
            </div>
        </div>
    );
};

export default PublicChatScreen;