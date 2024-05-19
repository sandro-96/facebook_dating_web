import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import axios from "axios";
import Avatar from "../Avatar";
import {useNavigate} from 'react-router-dom';
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {useTranslation} from "react-i18next";
import Constant from "../Utils/Constant";
import LoadingAnimation from "../LoaderSpin/LoadingAnimation";

export const Chat = () => {
    const { messageWs } = useContext(WebSocketContext);
    const {userData} = useContext(UserContext);
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadTopics()
    }, []);
    useEffect(() => {
        if (messageWs) {
            if (messageWs.type === Constant.SOCKET.SOCKET_TOPIC_NEW)
                setTopics([...topics, messageWs.data]);
            if (messageWs.type === Constant.SOCKET.SOCKET_TOPIC_DELETE)
                setTopics(topics.filter(topic => topic.id !== messageWs.data.id))
            if (messageWs.type === Constant.SOCKET.SOCKET_CHAT_UPDATE) {
                setTopics(topics.map(topic => {
                    if (topic.id === messageWs.topicId) {
                        return {...topic, lastMessage: messageWs.lastMessage, unread: true}
                    }
                    return topic;
                }))
            }
        }
    }, [messageWs]);

    const openChat = (id, userInfo) => {
        navigate(`/chat/${id}?isHideNavBar=true`, { state: {topicId: id, userInfo: userInfo} });
    };

    const loadTopics = async () => {
        try {
            const response = await axios.get(`topic/topicsWithLatestChat`);
            setTopics(response.data);
            setIsLoaded(true);
        } catch (error) {
            console.error('Failed to load topics:', error);
        }
    };

    const MatchItem = ({value}) => {
        const {username, avatar, gender, birthYear, id, bio} = userData.id === value.user1.id ? value.user2 : value.user1;

        return (
            <div role="button" className={`match-item gap-1`}
                 onClick={() => openChat(value.id, {username, avatar, gender, birthYear, id, bio})}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48}/>
                <div className={`flex-grow-1-text-start ${value.unread && 'unread'}`}>
                    <span className='fs-3 ellipsis'>{username}</span>
                    <div className='fw-normal bio'>{value.lastMessage ? value.lastMessage.imagePath ? t('chat.imageSent') : value.lastMessage.content : value.description}</div>
                </div>
                {value.unread && <div className="red-dot"></div>}
            </div>
        );
    };

    return (
        <div className="chat-wrap">
            <h2>{t('chat.title')}</h2>
            {
                !isLoaded && <LoadingAnimation/>
            }
            {
                isLoaded && <div className="content-wrap">
                    {topics.length === 0 ? (
                        <span className="noRecords">{t('chat.noRecord')}</span>
                    ) : (
                        topics.map((topic, index) => (
                            <MatchItem key={`match-item_${index}`} value={topic} index={index}/>
                        ))
                    )}
                </div>
            }
        </div>
    )
}
Chat.propTypes = {};

export default Chat;