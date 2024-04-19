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

export const ChatScreen = () => {
    const { messageWs } = useContext(WebSocketContext);
    const { state } = useLocation();
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo] = useState(state.userInfo);
    const messagesEndRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const idPopper = open ? 'leave-chat-popover' : undefined;

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
            if (messageWs.type === Constant.SOCKET.SOCKET_TOPIC_DELETE) {
                navigate('/chat');
            } else {
                setMessages([...messages, messageWs]);
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
        if (newMessage.trim() !== '' || selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('forUserId', userInfo.id);
                formData.append('topicId', state.topicId);
                formData.append('content', newMessage);

                await axios.post(`chat`, formData);

                setNewMessage('');
                setMessages([...messages, { content: newMessage, forUserId: userInfo.id, imagePath: selectedFile ? selectedFile.name : null}]);
                setSelectedFile(null);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    const handleDeleteChat = () => {
        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có muốn xóa đoạn chat này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => {
                        axios.delete(`topic/deleteTopic/${state.topicId}`)
                            .then(() => navigate(-1));
                    }
                },
                {
                    label: 'Không',
                    onClick: () => {
                        setAnchorEl(null)
                    }
                }
            ]
        });
    };

    return (
        <div className="chat-screen-wrap">
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
                        <span>Trở về</span>
                        <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                    </div>
                    <div className="divider"></div>
                    <div className="leave-chat-popover-item" onClick={handleDeleteChat}>
                        <span>Xóa đoạn chat</span>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg"/>
                    </div>
                </div>
            </Popper>
            <div className="content-wrap">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`message-item ${message.forUserId === userInfo.id ? 'right' : 'left'} ${message.imagePath && 'image'}`}
                         ref={index === messages.length - 1 ? messagesEndRef : null}>
                        {
                            message.forUserId !== userInfo.id &&
                            <Avatar imgKey={userInfo.avatar} genderKey={userInfo.gender} sizeKey={30}/>
                        }
                        <div className="message-content">
                            {
                                message.imagePath ?
                                    <img
                                        src={`${process.env.REACT_APP_API_BASE_URL}/chat/image/${message.imagePath}?topicId=${state.topicId}`}
                                        alt="Chat Image"
                                        style={{ maxWidth: 200}}
                                        onLoad={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                                    />
                                    : message.content
                            }
                        </div>
                    </div>
                ))}
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
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} size="2x"
                                 style={{color: "#74C0FC"}}/>
            </div>
        </div>
    );
};

export default ChatScreen;