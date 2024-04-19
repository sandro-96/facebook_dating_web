import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import axios from "axios";
import Avatar from "../Avatar";
import {useLocation, useNavigate} from 'react-router-dom';
import {WebSocketContext} from "../WebSocket/WebSocketComponent";

export const Chat = () => {
    const { messageWs } = useContext(WebSocketContext);
    const {userData} = useContext(UserContext);
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadTopics();
    }, [userData]);
    useEffect(() => {
        if (messageWs) {
            loadTopics();
        }
    }, [messageWs]);

    const openChat = (id, userInfo) => {
        navigate(`/chat/${id}?isHideNavBar=true`, { state: {topicId: id, userInfo: userInfo} });
    };

    const loadTopics = async () => {
        try {
            const response = await axios.get(`topic/topicsWithLatestChat/${userData.id}`);
            setTopics(response.data);
        } catch (error) {
            console.error('Failed to load topics:', error);
        }
    };

    const MatchItem = ({value}) => {
        const {username, avatar, gender, birthYear, id} = userData.id === value.user1.id ? value.user2 : value.user1;

        return (
            <div className={`match-item gap-1`}
                 onClick={() => openChat(value.id, {username, avatar, gender, birthYear, id})}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48}/>
                <div className={`flex-grow-1-text-start ${value.unread && 'unread'}`}>
                    <span className='fs-3'>{username}</span>
                    <div className='fw-normal bio'>{value.lastMessage ? value.lastMessage.imagePath ? "Đã gửi một hình ảnh" : value.lastMessage.content : value.description}</div>
                </div>
                {value.unread && <div className="red-dot"></div>}
            </div>
        );
    };

    return (
        <div className="chat-wrap">
            <h2>Đoạn chat</h2>
            <div className="content-wrap">
                {topics.length === 0 ? (
                    <span className="noRecords">Không có cuộc trò chuyện nào gần đây</span>
                ) : (
                    topics.map((topic, index) => (
                        <MatchItem key={`match-item_${index}`} value={topic} index={index}/>
                    ))
                )}
            </div>
        </div>
    )
}
Chat.propTypes = {};

export default Chat;