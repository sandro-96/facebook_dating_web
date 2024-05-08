import "./index.scss"
import {useContext, useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHouse, faCommentDots, faGear } from '@fortawesome/free-solid-svg-icons';
import Constant from "../Utils/Constant";
import {UserContext} from "../Context/UserContext";
import {useLocation, useNavigate} from "react-router-dom";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {useTranslation} from "react-i18next";

export const Navbar = (props) => {
    const { messageWs } = useContext(WebSocketContext);
    const { isAuthenticated, contextStatus } = useContext(UserContext);
    const [ selectedTab, setSelectedTab ] = useState('home');
    const navigate = useNavigate()
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        setSelectedTab(location.pathname.substring(1))
    }, [location.pathname, messageWs]);

    const onSelectTab = (tab) => {
        setSelectedTab(tab);
        navigate('/' + tab)
    };

    return (
        isAuthenticated &&
        contextStatus === Constant.CONTEXT_STATUS.SUCCESS &&
        <div className="nav-menu">
            <div onClick={() => onSelectTab('home')}
                 className={`nav-item ${selectedTab === 'home' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHouse} size="1x"
                                 style={{color: selectedTab === 'home' ? "#aad3f3" : "#ffffff"}}/>
                <span>{t('navBar.home')}</span>
            </div>
            <div onClick={() => onSelectTab('chat')}
                 className={`nav-item ${selectedTab.startsWith('chat') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faCommentDots} size={"1x"}
                                 style={{color: selectedTab.startsWith('chat') ? "#aad3f3" : "#ffffff"}}/>
                <span>{t('navBar.chat')}</span>
            </div>
            <div onClick={() => onSelectTab('match')}
                 className={`nav-item ${selectedTab.startsWith('match') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHeart} size={"1x"}
                                 style={{color: selectedTab.startsWith('match') ? "#aad3f3" : "#ffffff"}}/>
                <span>{t('navBar.match')}</span>
            </div>
            <div onClick={() => onSelectTab('setting')}
                 className={`nav-item ${selectedTab.startsWith('setting') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faGear} size="1x"
                                 style={{color: selectedTab.startsWith('setting') ? "#aad3f3" : "#ffffff"}}/>
                <span>{t('navBar.setting')}</span>
            </div>
        </div>
    )
}
Navbar.propTypes = {};

export default Navbar;