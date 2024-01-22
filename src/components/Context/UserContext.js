import React, {createContext, useEffect, useState} from "react";

const defaultUserContext = {}
export const UserContext = createContext(defaultUserContext);

export const UserContextProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
    }, []);

    return <UserContext.Provider
        value={{
            isAuthenticated,
            setIsAuthenticated
        }}
    >
        {props.children}
    </UserContext.Provider>
}