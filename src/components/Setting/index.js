import "./index.scss"
import React, {useContext} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faCircleQuestion, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import Constant from "../Utils/Constant";
import {useTranslation} from "react-i18next";

const Setting = () => {
    const {userData, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const logout = () => {
        localStorage.removeItem(Constant.LOCAL_STORAGE.AUTHORIZATION)
        setIsAuthenticated(false)
        navigate('/')
    }

    const Item = ({children, icon, onClick}) => (
        <div className="item-wrap" role='button' onClick={onClick}>
            <span className="fs-6 fw-bold">{children}</span>
            {icon ?
                <FontAwesomeIcon icon={icon} size="xl"/> :
                <Avatar imgKey={userData.avatar} genderKey={userData.gender} sizeKey={48} />
            }
        </div>
    )

    return (
        <div className="setting-wrap">
            <h2>{t('setting.title')}</h2>
            <div className="content-wrap">
                <Item onClick={() => navigate('/setting/profile')}>
                    <div className="flex-grow-1 text-start d-flex flex-column ms-2">
                        <span className='fs-3'>{userData.username}</span>
                        <div className='fw-normal bio'>{userData.email}</div>
                    </div>
                </Item>
                <Item icon={faPaperPlane}>{t('setting.feedback')}</Item>
                <Item icon={faCircleQuestion}>{t('setting.support')}</Item>
                <Item icon={faRightFromBracket} onClick={logout} style={{color: '#ff5050'}}>{t('setting.logout')}</Item>
            </div>
        </div>
    )
}

export default Setting;