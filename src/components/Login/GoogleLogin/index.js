import React from "react";
import LogoGoogle from "../assets/google.svg";

const GoogleLogin = props => {
  return (
      <div className="lp-btn">
          <a className="btn" href={`http://localhost:8080/oauth2/authorization/google`} role="button">
              <img width="19px" className="m-auto" alt="Google sign-in" src={LogoGoogle}/>
              Đăng nhập với Google
          </a>
      </div>
  );
};

GoogleLogin.propTypes = {};

export default GoogleLogin;
