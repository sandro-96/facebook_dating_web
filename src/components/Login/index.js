import "./index.scss"
import GoogleLogin from './GoogleLogin';
import {useContext, useEffect} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated]);
    return (
        <div className="login-wrap">
            <h2 className="mb-5">Đăng nhập</h2>
            <div className="lp-button-group">
                <GoogleLogin/>
            </div>
        </div>
    )
}
Login.propTypes = {};

export default Login;