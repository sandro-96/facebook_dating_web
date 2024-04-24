import React from "react";
import LogoGoogle from "../assets/google.svg";
import {useTranslation} from "react-i18next";

const GoogleLogin = props => {
    const { t } = useTranslation();
  return (
      <div className="lp-btn">
          <a className="btn" href={`http://localhost:8080/oauth2/authorization/google`} role="button">
              <img width="19px" className="m-auto" alt="Google sign-in" src={LogoGoogle}/>
              {t('login.withGG')}
          </a>
      </div>
  );
};

GoogleLogin.propTypes = {};

export default GoogleLogin;
