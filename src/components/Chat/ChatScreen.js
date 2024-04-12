import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation, useParams} from 'react-router-dom';
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faSquareArrowUpRight} from "@fortawesome/free-solid-svg-icons";

const ChatScreen = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo, setUserInfo] = useState(state.userInfo);

    useEffect(() => {
        // Load the chat messages when the component mounts
        console.log(state.topicId)
        loadMessages();
    }, [id]);

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
        try {
            await axios.post(`chat`, {
                forUserId: userInfo.id,
                topicId: state.topicId,
                content: newMessage
            });
            setNewMessage('');
            //loadMessages();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="chat-screen-wrap">
            <div className="d-flex align-items-center justify-content-center">
                <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                <span className='fs-4 ms-2'>{userInfo.username} {userInfo.birthYear > 0 && <span>, {DateUtils.calculateOlds(userInfo.birthYear)}</span>}</span>
            </div>
            <div className="content-wrap">
                {messages.map((message, index) => (
                    <div key={index} className={`message-item ${message.forUserId === userInfo.id ? 'left' : 'right'}`}>
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
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x" style={{color: "#74C0FC"}}/>
            </div>
        </div>
    );
};

export default ChatScreen;