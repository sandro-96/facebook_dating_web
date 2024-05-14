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
    faImage,
    faFaceSmile,
    faFaceLaughSquint,
    faFaceAngry,
    faFaceSadTear, faHeart, faFaceGrimace
} from "@fortawesome/free-solid-svg-icons";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {Popper} from "@mui/material";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Constant from "../Utils/Constant";
import {useTranslation} from "react-i18next";
import AlertPopup from "../Utils/AlertPopup";
import {UserContext} from "../Context/UserContext";
import ImageModal from "../Utils/ImageModal";
import InfiniteScroll from "react-infinite-scroll-component";
import UserCardInfo from "../UserCard/UserCardInfo";

const PAGE_SIZE = 50;

const EMOJI_ICONS = [
    {icon: faFaceSmile, color: "#6b6a6a"},
    {icon: faHeart, color: "#ff003f"},
    {icon: faFaceGrimace, color: "#00b2ff"},
    {icon: faFaceLaughSquint, color: "#fdcd4d"},
    {icon: faFaceAngry, color: "#ff4200"},
    {icon: faFaceSadTear, color: "#fdcd4d"},
]

export const ChatScreen = () => {
    const { messageWs, setMessageWs } = useContext(WebSocketContext);
    const { userData } = useContext(UserContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo] = useState(state.userInfo);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEmojiEl, setAnchorEmojiEl] = useState(null);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isInitialMessage, setIsInitialMessage] = useState(false);
    const [isUserLeaved, setIsUserLeaved] = useState(false);
    const [showUserCard, setShowUserCard] = useState(false);
    const [selectedIcons, setSelectedIcons] = useState({});
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const idPopper = open ? 'leave-chat-popover' : undefined;

    useEffect(() => {
        axios.get(`fbd_topics/${state.topicId}`)
            .then(response => loadMessages(page))
            .catch(() => {
                setIsInitialMessage(true);
                setIsUserLeaved(true);
            })
            .finally(() => setIsInitialMessage(true));
    }, [id]);

    useEffect(() => {
        if (messageWs && messageWs.topicId === state.topicId) {
            if (messageWs.type === Constant.SOCKET.SOCKET_TOPIC_DELETE) {
                setIsUserLeaved(true);
            } else if (messageWs.type === Constant.SOCKET.SOCKET_CHAT_UPDATE) {
                if (isInitialMessage) setMessages([messageWs, ...messages]);
                setMessageWs(null)
            } else if (messageWs.type === Constant.SOCKET.SOCKET_CHAT_EMOJI) {
                setMessages(messages.map(message => message.id === messageWs.id ? messageWs : message));
                setMessageWs(null)
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

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
            event.preventDefault();
        }
    };

    const showEmoji = (event, messageId) => {
        if (anchorEmojiEl && anchorEmojiEl.id === messageId) {
            // If the emoji popper is currently shown for the same message, hide it
            setAnchorEmojiEl(null);
        } else {
            // Otherwise, show the emoji popper for the current message
            setAnchorEmojiEl({ anchor: event.currentTarget, id: messageId });
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
        setAnchorEl(null)
        AlertPopup.confirm(t('chat.confirmMessage'), t('chat.ok'), t('chat.cancel'), deleteChat);
    };

    const fetchMoreData = () => {
        if (page < totalPage - 1) {
            setPage(page + 1); // increment page number
            loadMessages(page + 1);
        }
    }

    const hasMore = () => {
        if (isUserLeaved) return false;
        return page < totalPage - 1;
    }
    const closeUserCard = () => {
        setShowUserCard(false)
    }
    const handleIconClick = (index, messageId) => {
        setSelectedIcons(prevIcons => ({ ...prevIcons, [messageId]: index }));
        setAnchorEmojiEl(null);
        axios.put(`/chat/message/${messageId}/emoji`, {emoji: index}).then(() => {});
    };

    return (
        <div className="chat-screen-wrap">
            <ImageModal selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
            <div className="top-bar">
                <div role="button" className="name-wrap" onClick={() => setShowUserCard(true)}>
                    <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                    <span className='fs-4 ms-2 ellipsis'>{userInfo.username} {userInfo.birthYear > 0 &&
                        <span>, {DateUtils.calculateOlds(userInfo.birthYear)}</span>}</span>
                </div>
                <FontAwesomeIcon role="button" icon={faBars} size="lg" onClick={handleClick}/>
            </div>
            <UserCardInfo data={userInfo} isOpen={showUserCard} closeUserCard={closeUserCard}></UserCardInfo>
            <Popper id={idPopper} open={open} anchorEl={anchorEl}>
                <div className="leave-chat-popover-body">
                    <div role="button" className="leave-chat-popover-item" onClick={() => navigate(-1)}>
                        <span>{t('chat.goBack')}</span>
                        <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                    </div>
                    <div className="divider"></div>
                    {!isUserLeaved &&
                        <div role="button" className="leave-chat-popover-item" onClick={handleDeleteChat}>
                            <span>{t('chat.deleteChat')}</span>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg"/>
                        </div>
                    }
                </div>
            </Popper>
            {isInitialMessage && <div className="content-wrap" id="scrollableDiv">
                <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchMoreData}
                    style={{
                        display: 'flex',
                        flexDirection: 'column-reverse'
                    }} //To put endMessage and loader to the top.
                    inverse={true} //
                    hasMore={hasMore()}
                    loader={<span>{t('chat.loading')}</span>}
                    scrollableTarget="scrollableDiv"
                >
                    {messages.map((message, index) => (
                        <div className="d-flex flex-column" key={index}>
                            {/*<MessageDate index={index} messages={messages} />*/}
                            {message.isLeave ? <div>lsdladsadas</div> :
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
                                        {
                                            message.forUserId === userInfo.id && message.emoji !== 0 &&
                                            <FontAwesomeIcon
                                                className="like-btn-right"
                                                icon={EMOJI_ICONS[message.emoji].icon}
                                                style={{color:  EMOJI_ICONS[message.emoji].color}}
                                                beat
                                            />
                                        }
                                        {message.imagePath ? <img
                                            src={`${process.env.REACT_APP_API_BASE_URL}/chat/image/${message.imagePath}?topicId=${state.topicId}`}
                                            alt="Chat Image"
                                            style={{maxWidth: 200}}
                                            onClick={() => setSelectedImage(`${process.env.REACT_APP_API_BASE_URL}/chat/image/${message.imagePath}?topicId=${state.topicId}`)}
                                        /> : <span style={{whiteSpace: 'normal'}}>{message.content}</span>
                                        }
                                        <span className="time">{DateUtils.formatTime(message.createdAt)}</span>
                                        {
                                            message.forUserId !== userInfo.id &&
                                            <FontAwesomeIcon
                                                className="like-btn"
                                                icon={selectedIcons[message.id] !== undefined ? EMOJI_ICONS[selectedIcons[message.id]].icon : EMOJI_ICONS[message.emoji].icon}
                                                style={{color: selectedIcons[message.id] !== undefined ? EMOJI_ICONS[selectedIcons[message.id]].color : EMOJI_ICONS[message.emoji].color}}
                                                onClick={(event) => showEmoji(event, message.id)}
                                                beat={message.emoji > 0 || selectedIcons[message.id] !== undefined}
                                            />
                                        }
                                        <Popper placement="top" open={Boolean(anchorEmojiEl) && anchorEmojiEl.id === message.id} anchorEl={anchorEmojiEl ? anchorEmojiEl.anchor : null}>
                                            <div className="emoji-popover">
                                                {EMOJI_ICONS.map((emoji, index) => (
                                                    index !== 0 && (
                                                        <FontAwesomeIcon
                                                            key={index}
                                                            icon={emoji.icon}
                                                            style={{color: emoji.color}}
                                                            onClick={() => handleIconClick(index, message.id)}
                                                            beat
                                                        />
                                                    )
                                                ))}
                                            </div>
                                        </Popper>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </InfiniteScroll>
            </div>}

            {isUserLeaved ? <div className="leave-message">{t('message.leave')}</div> :
                isInitialMessage && <div className="send-message-wrap stick-to-bottom">
                    <label htmlFor="file-upload">
                        <FontAwesomeIcon role="button" icon={faImage} size="2x" style={{color: "#74C0FC"}}/>
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
                    <FontAwesomeIcon role="button" icon={faPaperPlane} onClick={handleSendMessage} size="2x"
                                     style={{color: "#74C0FC"}}
                                     disabled={isSending}/>
                </div>
            }
        </div>
    );
};

export default ChatScreen;