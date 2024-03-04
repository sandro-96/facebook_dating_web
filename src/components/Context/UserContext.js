import React, {createContext, useEffect, useState} from "react";

const defaultUserContext = {}
export const UserContext = createContext(defaultUserContext);

export const UserContextProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('ROLE_USER');
    const [userData, setUserData] = useState({});

    useEffect(() => {
    }, []);

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