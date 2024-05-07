import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEarthAsia} from "@fortawesome/free-solid-svg-icons";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { isAuthenticated, contextStatus, userData } = useContext(UserContext);
    const navigate = useNavigate()
    const [likedUsers, setLikedUsers] = useState([])
    const webSocket = useContext(WebSocketContext);
    const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (isAuthenticated && contextStatus === Constant.CONTEXT_STATUS.SUCCESS) {
            if (userData.isFirstLogin) navigate('/setting/profile?isHideNavBar=true')
            loadUserLikedYou()
        }
    }, [contextStatus, webSocket]);
    const loadUserLikedYou = () => {
        axios.get('users/likedList').then(value => {
            value.data && setLikedUsers(value.data)
        })
    }

    const startChat = (userId) => {
        if (isCreatingTopic) {
            return; // If a topic is already being created, do nothing
        }

        setIsCreatingTopic(true); // Set isCreatingTopic to true before starting the topic creation process

        axios.post('topic/createTopic', {
            forUserId: userId,
            description: t('home.startChat')
        }).then(value => {
            setLikedUsers(likedUsers.filter(user => user.id !== userId))
            navigate(`/chat/${value.data.id}?isHideNavBar=true`, {state: {topicId: value.data.id, userInfo: value.data.user2}})
        }).finally(() => {
            setIsCreatingTopic(false); // Set isCreatingTopic back to false when the topic creation process ends
        });
    }

    const MatchItem = ({value, index, startChat}) => {
        const {username, birthYear, bio, avatar, gender, id} = value;
        const age = birthYear > 0 ? `, ${DateUtils.calculateOlds(birthYear)}` : '';
        const genderClass = gender || 'other';

        return (
            <div key={`match-item_${index}`} className={`match-item gap-1 ${genderClass}`} onClick={() => startChat(id)}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48} />
                <div className="user-info">
                    <div className='fs-3'>
                        <div className='ellipsis'>{username}{age}</div>
                    </div>
                    <div className='fw-normal bio'>{bio}</div>
                </div>
            </div>
        );
    };

    return (
        userData && <div className="home-wrap">
            <div>
            <h1>FAction</h1>
                <div className="d-flex gap-3 align-items-center mt-4">
                    <Avatar imgKey={userData.avatar} genderKey={userData.gender}></Avatar>
                    <div className="flex-grow-start-column">
                    <span className="fs-2 fw-bold ellipsis">{userData.username}{userData.birthYear > 0 &&
                        <span>, {DateUtils.calculateOlds(userData.birthYear)}</span>}</span>
                        <div className='fw-normal bio'>{userData.email}</div>
                    </div>
                </div>
                <h6 className='title'>{t('home.community')}</h6>
                <div className="public-chat-wrap" onClick={() => navigate('/chat/public?isHideNavBar=true')}>
                    <h3>{t('home.publicChat')}</h3>
                    <FontAwesomeIcon icon={faEarthAsia} size="2xl" style={{color: "#74C0FC",}}/>
                </div>
                <h6 className='title'>{t('home.userLiked')}</h6>
            </div>

            <div className="user-liked-wrap">
                {
                    likedUsers.map((value, index) => (
                        <MatchItem value={value} index={index} startChat={startChat} key={value.id}/>
                    ))
                }
            </div>
        </div>
    )
}
Home.propTypes = {};

export default Home;