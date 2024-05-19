import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowRight, faEarthAsia} from "@fortawesome/free-solid-svg-icons";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import { useTranslation } from 'react-i18next';
import GlobalAnimation from "./assets/global.json";
import Lottie from "lottie-react";

const Home = () => {
    const { isAuthenticated, contextStatus, userData, userLikedCount, lastPublicMessage } = useContext(UserContext);
    const navigate = useNavigate()
    const [likedCount, setLikedCount] = useState(0)
    const webSocket = useContext(WebSocketContext);
    const { t } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (isAuthenticated && contextStatus === Constant.CONTEXT_STATUS.SUCCESS) {
            if (userData.isFirstLogin) navigate('/setting/profile?isHideNavBar=true')
            setIsLoaded(true)
            setLikedCount(userLikedCount)
        }
    }, [contextStatus, webSocket]);

    const getRandomColor = () => {
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = Math.floor(Math.random() * 128) + 128; // Generate a number between 128 and 255
            const part = value.toString(16); // Convert the number to a hexadecimal string
            color += part.length < 2 ? '0' + part : part;
        }
        return color;
    };

    return (
        userData && isLoaded  && <div className="home-wrap">
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
                    <div className="public-chat-header">
                        <h3>{t('home.publicChat')}</h3>
                        <Lottie animationData={GlobalAnimation} style={{width: "50px", height: "50px"}} />
                        {/*<FontAwesomeIcon icon={faEarthAsia} size="2xl" style={{color: "#74C0FC"}}/>*/}
                    </div>
                    <div className='fw-normal bio' style={{color: getRandomColor()}}>{lastPublicMessage}</div>
                </div>
            </div>
            {
                likedCount > 0 &&
                <div role="button" className="user-liked" onClick={() => navigate('/home/likedUser?isHideNavBar=true')}>
                    <span>{likedCount}{t('home.userLiked')}</span>
                    <FontAwesomeIcon icon={faCircleArrowRight} size="2xl" style={{color: 'rgba(239,174,230,0.8)'}}/>
                </div>
            }
        </div>
    )
}
Home.propTypes = {};

export default Home;