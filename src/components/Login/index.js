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
            <h2 className="mb-5">Fdating.online</h2>
            <div>{t('login.desc')}</div>
            <div className="tag-wrap">
                <div className="tag first">{t('login.tag1')}</div>
                <div className="tag second">{t('login.tag2')}</div>
                <div className="tag third">{t('login.tag3')}</div>
                <div className="tag fourth">{t('login.tag4')}</div>
            </div>
            <div className="lp-button-group mt-5">
                <div>{t('login.signInOrSignUp')}</div>
                <GoogleLogin/>
            </div>
        </div>
    )
}
Login.propTypes = {};

export default Login;