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
import 'react-confirm-alert/src/react-confirm-alert.css';
import Constant from "../Utils/Constant";
import MessageDate from "./MessageDate";
import {useTranslation} from "react-i18next";
import AlertPopup from "../Utils/AlertPopup";
import {UserContext} from "../Context/UserContext";
import ImageModal from "../Utils/ImageModal";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 10;

export const ChatScreen = () => {
    const { messageWs } = useContext(WebSocketContext);
    const { userData } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo] = useState(state.userInfo);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const idPopper = open ? 'leave-chat-popover' : undefined;

    useEffect(() => {
        loadMessages(page);
    }, [id]);

    useEffect(() => {
        if (messageWs && messageWs.topicId === state.topicId) {
            if (messageWs.type === Constant.SOCKET.SOCKET_TOPIC_DELETE) {
                navigate('/chat');
            } else {
                setMessages([messageWs, ...messages]);
            }
        }
    }, [messageWs]);
    useEffect(() => {
        if (selectedFile) {
            handleSendMessage();
        }
    }, [selectedFile]);

    const handleFileChange = (event) => {
        // Create a new message with the selected file
        setSelectedFile(event.target.files[0]);
    };

    const loadMessages = async (page) => {
        try {
            const response = await axios.get(`chat/messages/${state.topicId}?page=${page}&size=${PAGE_SIZE}`);
            if (response && response.data) {
                setMessages(oldMessages => [ ...oldMessages, ...response.data.content.reverse()]);
                setTotalPage(response.data.totalPages);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop} = e.currentTarget;
        if (scrollTop === 0) { // top of the chat
            if (page < totalPage - 1) {
                setPage(page + 1); // increment page number
                loadMessages(page + 1);
            }
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
        if ((newMessage.trim() !== '' || selectedFile) && !isSending) {
            setIsSending(true);
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('forUserId', userInfo.id);
                formData.append('topicId', state.topicId);
                formData.append('content', newMessage);

                const  response = await axios.post(`chat`, formData);
                if (response) {
                    setNewMessage('');
                    setMessages([response.data, ...messages]);
                    setSelectedFile(null);
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };
    const deleteChat = async () => {
        try {
            await axios.delete(`topic/deleteTopic/${state.topicId}`);
            navigate(-1);
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    }

    const handleDeleteChat = () => {
        AlertPopup.confirm(t('chat.confirm'), t('chat.confirmMessage'), t('chat.ok'), t('chat.cancel'), deleteChat, setAnchorEl(null));
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
            <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <div className="top-bar">
                <div className="name-wrap">
                    <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                    <span className='fs-4 ms-2'>{userInfo.username} {userInfo.birthYear > 0 && <span>, {DateUtils.calculateOlds(userInfo.birthYear)}</span>}</span>
                </div>
                <FontAwesomeIcon icon={faBars} size="lg" onClick={handleClick}/>
            </div>
            <Popper id={idPopper} open={open} anchorEl={anchorEl}>
                <div className="leave-chat-popover-body">
                    <div className="leave-chat-popover-item" onClick={() => navigate(-1) }>
                        <span>{t('chat.goBack')}</span>
                        <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                    </div>
                    <div className="divider"></div>
                    <div className="leave-chat-popover-item" onClick={handleDeleteChat}>
                        <span>{t('chat.deleteChat')}</span>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg"/>
                    </div>
                </div>
            </Popper>
            <div className="content-wrap" id="scrollableDiv">
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMoreData}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                    inverse={true} //
                    hasMore={hasMore()}
                    loader={<span>Loading...</span>}
                    scrollableTarget="scrollableDiv"
                >
                    {messages.map((message, index) => (
                        <div className="d-flex flex-column" key={index}>
                            {/*<MessageDate index={index} messages={messages} />*/}
                            <div
                                id={`id_${index}`}
                                key={index}
                                className={`message-item ${message.createdBy === userData.id ? 'right' : 'left'}`}
                            >
                                {
                                    message.forUserId !== userInfo.id &&
                                    <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                                }
                                <div className={`message-content ${message.imagePath && 'image'}`}>
                                    {message.imagePath ? <img
                                        src={`${process.env.REACT_APP_API_BASE_URL}/chat/image/${message.imagePath}?topicId=${state.topicId}`}
                                        alt="Chat Image"
                                        style={{maxWidth: 200}}
                                        onClick={() => setSelectedImage(`${process.env.REACT_APP_API_BASE_URL}/chat/image/${message.imagePath}?topicId=${state.topicId}`)}
                                    /> : <span>{message.content}</span>
                                    }
                                    <span className="time">{DateUtils.formatTime(message.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
            <div className="send-message-wrap stick-to-bottom">
                <label htmlFor="file-upload">
                    <FontAwesomeIcon icon={faImage} size="2x" style={{color: "#74C0FC"}}/>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
                <input
                    className="form-control"
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x" style={{color: "#74C0FC"}}
                                 disabled={isSending}/>
            </div>
        </div>
    );
};

export default ChatScreen;