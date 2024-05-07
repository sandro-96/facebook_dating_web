import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
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
import InfiniteScroll from "react-infinite-scroll-component";
import {useTranslation} from "react-i18next";

const PAGE_SIZE = 100;

export const PublicChatScreen = () => {
    const { messageWs, setMessageWs } = useContext(WebSocketContext);
    const { userData } = useContext(UserContext);
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [isInitialMessage, setIsInitialMessage] = useState(false);
    useEffect(() => {
        loadMessages(page);
    }, []);
    useEffect(() => {
        if (messageWs &&
            messageWs.type === Constant.SOCKET.SOCKET_PUBLIC_CHAT_NEW_MESSAGE
            && messageWs.data.createdBy !== userData.id
        ) {
            isInitialMessage && setMessages([messageWs.data, ...messages]);
            setMessageWs(null);
        }
    }, [messageWs]);
    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const loadMessages = async (page) => {
        try {
            const response = await axios.get(`chat/public?page=${page}&size=${PAGE_SIZE}`);
            if (response && response.data) {
                setTotalPage(response.data.totalPages);
                const newMessages = response.data.content.reverse();
                setMessages(oldMessages => [ ...oldMessages, ...newMessages]);
                setIsInitialMessage(true);
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
                    setMessages([response.data, ...messages]);
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
    const fetchMoreData = () => {
        if (page < totalPage - 1) {
            setPage(page + 1); // increment page number
            loadMessages(page + 1);
        }
    }
    const hasMore = () => {
        return page < totalPage - 1;
    }
    return (
        <div className="chat-screen-wrap">
            <div className="top-bar">
                <div className="name-wrap">
                    {t('chat.publicChat')}
                </div>
            </div>
            <div className="content-wrap" id="scrollableDiv">
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMoreData}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                    inverse={true} //
                    hasMore={hasMore()}
                    loader={<span>{t('chat.loading')}</span>}
                    scrollableTarget="scrollableDiv"
                >
                    {messages.map((message, index) => (
                        <div className="d-flex flex-column" key={index} id={index}>
                            <div key={index}
                                 className={`message-item ${message.createdBy === userData.id ? 'right' : 'left'}`}
                            >
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
                </InfiniteScroll>
            </div>
            <div className="send-message-wrap stick-to-bottom">
                <input
                    className="form-control"
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={(event) => event.preventDefault()}
                />
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x"
                                 style={{color: "#74C0FC"}} disabled={isSending}/>
            </div>
        </div>
    );
};

export default PublicChatScreen;