import "./index.scss"
import React, {useContext} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";
import {faCircleQuestion, faPaperPlane, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Constant from "../Utils/Constant";

const Setting = () => {
    const {userData, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem(Constant.LOCAL_STORAGE.AUTHORIZATION)
        setIsAuthenticated(false)
        navigate('/')
    }
    return (
        <div className="setting-wrap">
            <h2>Trang cá nhân</h2>
            <div className="content-wrap">
                <div className="item-wrap" onClick={() => navigate('/setting/profile')} role='button'>
                    <span className="fs-5 fw-bold">{userData.username}</span>
                    <Avatar imgKey={userData.avatar} genderKey={userData.gender} sizeKey={48}></Avatar>
                </div>
                <div className="item-wrap" role='button'>
                    <span className="fs-6 fw-bold">Đóng góp ý kiến</span>
                    <FontAwesomeIcon icon={faPaperPlane} size="xl"/>
                </div>
                <div className="item-wrap" role='button'>
                    <span className="fs-6 fw-bold">Trợ giúp & hỗ trợ</span>
                    <FontAwesomeIcon icon={faCircleQuestion} size="xl"/>
                </div>
                <div className="item-wrap log-out" role='button' onClick={() => logout()}>
                    <span className="fs-6 fw-bold" style={{ color: '#ff5050'}}>Đăng xuất</span>
                    <FontAwesomeIcon icon={faRightFromBracket} size="xl" style={{ color: '#ff5050'}}/>
                </div>
            </div>
        </div>
    )
}
Setting.propTypes = {};

export default Setting;