import React, {useState, useEffect, useRef, createContext, useContext} from 'react';
import axios from 'axios';
import {useLocation, useParams} from 'react-router-dom';
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faBars} from "@fortawesome/free-solid-svg-icons";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {Popover, Button} from "react-bootstrap";
export const ChatScreen = () => {
    const { messageWs } = useContext(WebSocketContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo] = useState(state.userInfo);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadMessages();
    }, [id]);

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

    const loadMessages = async () => {
        try {
            const response = await axios.get(`chat/messages/ordered/${state.topicId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
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
                await axios.post(`chat`, {
                    forUserId: userInfo.id,
                    topicId: state.topicId,
                    content: newMessage
                });
                setNewMessage('');
                setMessages([...messages, { content: newMessage, forUserId: userInfo.id }]);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="chat-screen-wrap">
            <div className="top-bar">
                <div className="name-wrap">
                    <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                    <span className='fs-4 ms-2'>{userInfo.username} {userInfo.birthYear > 0 && <span>, {DateUtils.calculateOlds(userInfo.birthYear)}</span>}</span>
                </div>
                <FontAwesomeIcon icon={faBars} size="lg"/>
            </div>
            <div className="content-wrap">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`message-item ${message.forUserId === userInfo.id ? 'right' : 'left'}`}
                         ref={index === messages.length - 1 ? messagesEndRef : null}>
                        {
                            message.forUserId !== userInfo.id &&
                            <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                        }
                        <div className="message-content">
                            {message.content}
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
                                 style={{color: "#74C0FC"}}/>
            </div>
        </div>
    );
};

export default ChatScreen;