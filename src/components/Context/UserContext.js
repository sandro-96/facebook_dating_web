import React, {createContext, useEffect, useState} from "react";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";

const defaultUserContext = {}
export const UserContext = createContext(defaultUserContext);

export const UserContextProvider = (props) => {
    const token = localStorage.getItem(Constant.LOCAL_STORAGE.AUTHORIZATION) || '';
    const [isAuthenticated, setIsAuthenticated] = useState(token.length > 0);
    const [role, setRole] = useState('ROLE_USER');
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/')
    }, [isAuthenticated]);

    return <UserContext.Provider
        value={{
            isAuthenticated,
            setIsAuthenticated,
            role,
            setRole,
            userData,
            setUserData
        }}
    >
        {props.children}
    </UserContext.Provider>
}