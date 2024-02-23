import React from "react";
import LogoGoogle from "../assets/google.svg";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const GoogleLogin = props => {
  return (
    <div className="lp-btn">
      <a className="btn" href={`${baseURL}/oauth2/authorization/google-careermon-hr`} role="button">
        <img width="19px" className="m-auto" alt="Google sign-in" src={LogoGoogle} />
          Đăng nhập với Google
      </a>
    </div>
  );
};

GoogleLogin.propTypes = {

};

export default GoogleLogin;
