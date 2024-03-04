import "./index.scss"
import GoogleLogin from './GoogleLogin';
import {useEffect} from "react";

const Login = () => {
    useEffect(() => {
    }, []);
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