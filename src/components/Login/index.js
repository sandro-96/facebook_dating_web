import "./index.scss"
import { useForm } from "react-hook-form";
import {Link} from "react-router-dom";

const Login = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data);
    };
    return (
        <div className="login-wrap">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="mb-5">Sign In</h2>
                <div className="login-form">
                    <input className="form-control" {...register("userName", { required: true })} placeholder="Enter User Name"/>
                    {errors.userName && <div className="error-text">This field is required</div>}
                    <input className="form-control" {...register("password", { required: true })} placeholder="Enter Password"/>
                    {errors.password && <div className="error-text">This field is required</div>}
                    <input className="button" type="submit" />
                </div>
                <span>Not a member? <Link to="/signUp">Register</Link></span>
            </form>
        </div>
    )
}
Login.propTypes = {};

export default Login;