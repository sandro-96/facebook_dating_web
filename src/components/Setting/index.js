import "./index.scss"
import React, {useContext} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faCircleQuestion, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import Constant from "../Utils/Constant";
import {useTranslation} from "react-i18next";
import VietNamFlag from "./assets/vietnam.png";
import UKFlag from "./assets/united-kingdom.png";
import i18n from "i18next";

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

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    }

    return (
        <div className="setting-wrap">
            <h2>{t('setting.title')}</h2>
            <div className="content-wrap">
                <Item onClick={() => navigate('/setting/profile')}>
                    <div className="user-info">
                        <div className='fs-3'>
                            <div className='ellipsis'>{userData.username}</div>
                        </div>
                        <div className='fw-normal bio'>{userData.email}</div>
                    </div>
                </Item>
                <Item icon={faPaperPlane} onClick={() => navigate('feedback?isHideNavBar=true')}>{t('setting.feedback')}</Item>
                <Item icon={faCircleQuestion} onClick={() => navigate('support?isHideNavBar=true')}>{t('setting.support')}</Item>
                <div className="item-wrap">
                    <span className="fs-6 fw-bold">{t('setting.language')}</span>
                    <div className="d-flex gap-2">
                        <div className={`p-1 ${(localStorage.getItem('language') === null || localStorage.getItem('language') === 'vi') && 'selected'}`} onClick={() => changeLanguage('vi')}><img src={VietNamFlag} width={24} height={24} alt={'vi-flag'}/></div>
                        <div className={`p-1 ${localStorage.getItem('language') === 'en' && 'selected'}`} onClick={() => changeLanguage('en')}><img src={UKFlag} width={24} height={24} alt={'uk-flag'}/></div>
                    </div>
                </div>
                <Item icon={faRightFromBracket} onClick={logout} style={{color: '#ff5050'}}>{t('setting.logout')}</Item>
            </div>
        </div>
    )
}

export default Setting;