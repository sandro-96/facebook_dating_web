import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useTranslation } from 'react-i18next';

const baseURL = process.env.REACT_APP_API_BASE_URL;
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
    const { setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authorizationCode = queryParams.get(QUERY_PARAMS.AUTHORIZATION_CODE);
        let loginUrl = '';

    }, [location, navigate, t]);

    return <div>Loading...</div>;
};

LoginRedirectCallBack.propTypes = {};

export default LoginRedirectCallBack;
