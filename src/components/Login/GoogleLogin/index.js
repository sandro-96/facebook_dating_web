import React from "react";
import LogoGoogle from "../assets/google.svg";
import {useTranslation} from "react-i18next";

const GoogleLogin = props => {
    const { t } = useTranslation();
    const authUrl = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google`;
    return (
        <div className="lp-btn">
            <a className="btn" href={authUrl} role="button">
                <img width="19px" className="m-auto" alt="Google sign-in" src={LogoGoogle}/>
                {t('login.withGG')}
            </a>
        </div>
    );
};

GoogleLogin.propTypes = {};

export default GoogleLogin;