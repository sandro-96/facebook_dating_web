import React, {useCallback, useContext, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import Constant from "../Utils/Constant";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const JWT_TOKEN_PREFIX = 'Bearer ';
const QUERY_PARAMS = {
    AUTHORIZATION_CODE: 'authorizationCode'
};
const LOGIN_TYPE = {
    GOOGLE: 'google',
    APPLE: 'apple'
};

const LoginRedirectCallBack = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { setIsAuthenticated, setRole, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const loginProcess = useCallback(
        (res) => {
            debugger
            let jwtToken = res.data.jwtToken;
            let role = res.data.role;
            let user = res.data.user;

            setIsAuthenticated(true);
            setRole(role);
            setUserData(user);
            sessionStorage.setItem(Constant.LOCAL_STORAGE.AUTHORIZATION, JWT_TOKEN_PREFIX + jwtToken);
            navigate('/home');
        },
        [setIsAuthenticated, setRole, setUserData, navigate]
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authorizationCode = queryParams.get(QUERY_PARAMS.AUTHORIZATION_CODE);
        let loginUrl = `/oauth2/google/login/process?authorizationCode=${authorizationCode}`;
        axios.get(loginUrl)
            .then(res => {
                debugger
                loginProcess(res);
            })
            .catch(reason => {
                debugger
                console.log(reason);
                navigate('/');
            })

    }, [location, navigate, t]);

    return <div>Loading...</div>;
};

LoginRedirectCallBack.propTypes = {};

export default LoginRedirectCallBack;
