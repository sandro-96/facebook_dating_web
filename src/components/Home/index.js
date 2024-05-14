import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowRight, faEarthAsia} from "@fortawesome/free-solid-svg-icons";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { isAuthenticated, contextStatus, userData } = useContext(UserContext);
    const navigate = useNavigate()
    const [likedUsers, setLikedUsers] = useState([])
    const webSocket = useContext(WebSocketContext);
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

    return (
        userData && <div className="home-wrap">
            <div>
            <h1>FDating</h1>
                <div className="d-flex gap-3 align-items-center mt-4">
                    <Avatar imgKey={userData.avatar} genderKey={userData.gender}></Avatar>
                    <div className="flex-grow-start-column">
                    <span className="fs-2 fw-bold ellipsis">{userData.username}{userData.birthYear > 0 &&
                        <span>, {DateUtils.calculateOlds(userData.birthYear)}</span>}</span>
                        <div className='fw-normal bio'>{userData.email}</div>
                    </div>
                </div>
                <h6 className='title'>{t('home.community')}</h6>
                <div role="button" className="public-chat-wrap" onClick={() => navigate('/chat/public?isHideNavBar=true')}>
                    <h3>{t('home.publicChat')}</h3>
                    <FontAwesomeIcon icon={faEarthAsia} size="2xl" style={{color: "#74C0FC"}}/>
                </div>
            </div>
            {
                likedUsers.length > 0 && <div role="button" className="user-liked" onClick={() => navigate('/home/likedUser?isHideNavBar=true')}>
                    <span>{likedUsers.length}{t('home.userLiked')}</span>
                    <FontAwesomeIcon icon={faCircleArrowRight} size="2xl" style={{color: 'rgba(239,174,230,0.8)'}}/>
                </div>
            }
        </div>
    )
}
Home.propTypes = {};

export default Home;