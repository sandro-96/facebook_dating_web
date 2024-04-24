import "./index.scss"
import GoogleLogin from './GoogleLogin';
import {useContext, useEffect} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Login = () => {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated]);
    return (
        <div className="login-wrap">
            <h2 className="mb-5">{t('login.title')}</h2>
            <div className="lp-button-group">
                <GoogleLogin/>
            </div>
        </div>
    )
}
Login.propTypes = {};

export default Login;