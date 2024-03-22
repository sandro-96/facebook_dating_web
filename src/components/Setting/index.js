import "./index.scss"
import {useContext} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";

const Setting = () => {
    const { isAuthenticated, contextStatus, userData } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <div className="setting-wrap">
            <button onClick={() => navigate('/setting/profile')}>Profile</button>
            setting
        </div>
    )
}
Setting.propTypes = {};

export default Setting;