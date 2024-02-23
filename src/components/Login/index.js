import "./index.scss"
import { useForm } from "react-hook-form";
import GoogleLogin from './GoogleLogin';

const Login = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data);
    };
    return (
        <div className="login-wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="mb-5">Đăng nhập</h2>
                <div className="lp-button-group">
                    <GoogleLogin />
                </div>
            </form>
        </div>
    )
}
Login.propTypes = {};

export default Login;