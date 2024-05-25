import React, {createContext, useEffect, useState} from "react";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const defaultUserContext = {}
export const UserContext = createContext(defaultUserContext);

export const UserContextProvider = (props) => {
    const token = localStorage.getItem(Constant.LOCAL_STORAGE.AUTHORIZATION) || '';
    const [contextStatus, setContextStatus] = useState(Constant.CONTEXT_STATUS.IDLE);
    const [isAuthenticated, setIsAuthenticated] = useState(token.length > 0);
    const [userLikedCount, setUserLikedCount] = useState(0)
    const [unreadTopics, setUnreadTopics] = useState([])
    const [lastPublicMessage, setLastPublicMessage] = useState('')
    const [role, setRole] = useState('ROLE_USER');
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/')
        else {
            const getUserInfo = async () => {
                try {
                    setContextStatus(Constant.CONTEXT_STATUS.LOADING);
                    const resultPromise = await axios.get(`getUserFromToken?token=${token.slice(7)}`).catch((err) => {
                        setContextStatus(Constant.CONTEXT_STATUS.FAILED);
                        localStorage.removeItem(Constant.LOCAL_STORAGE.AUTHORIZATION);
                        setIsAuthenticated(false);
                        setUserData({});
                        setUserLikedCount(0);
                        setUnreadTopics([])
                        navigate('/');
                    });
                    setContextStatus(Constant.CONTEXT_STATUS.SUCCESS);
                    let userInfo = resultPromise.data;
                    setUserData(userInfo.user);
                    setUserLikedCount(userInfo.userLikedCount);
                    setUnreadTopics(userInfo.unreadTopics);
                } catch (err) {
                    setContextStatus(Constant.CONTEXT_STATUS.FAILED);
                    console.log('Error: ' + err.message);
                }
            };
            getUserInfo().then(r => {});
        }
    }, [isAuthenticated]);

    return <UserContext.Provider
        value={{
            isAuthenticated,
            setIsAuthenticated,
            role,
            setRole,
            userData,
            userLikedCount,
            unreadTopics,
            setUserLikedCount,
            setUnreadTopics,
            setLastPublicMessage,
            lastPublicMessage,
            setUserData,
            contextStatus,
            setContextStatus,
        }}
    >
        {props.children}
    </UserContext.Provider>
}