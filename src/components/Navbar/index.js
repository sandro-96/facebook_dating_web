import "./index.scss"
import {useContext, useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faHouse, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Constant from "../Utils/Constant";
import {UserContext} from "../Context/UserContext";
import {useLocation, useNavigate} from "react-router-dom";

export const Navbar = (props) => {
    const { isAuthenticated, contextStatus } = useContext(UserContext);
    const [ selectedTab, setSelectedTab ] = useState('home');
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        setSelectedTab(location.pathname.substring(1))
    }, [location.pathname]);

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
                <FontAwesomeIcon icon={faHouse} size="xl"
                                 style={{color: selectedTab === 'home' ? "#ff5050" : "#ffffff"}}/>
            </div>
            <div onClick={() => onSelectTab('chat')}
                 className={`nav-item ${selectedTab.startsWith('chat') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faCommentDots} size={"xl"}
                                 style={{color: selectedTab.startsWith('chat') ? "#ff5050" : "#ffffff"}}/>
            </div>
            <div onClick={() => onSelectTab('match')}
                 className={`nav-item ${selectedTab.startsWith('match') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHeart} size={"xl"}
                                 style={{color: selectedTab.startsWith('match') ? "#ff5050" : "#ffffff"}}/>
            </div>
            <div onClick={() => onSelectTab('setting')}
                 className={`nav-item ${selectedTab.startsWith('setting') ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faUser} size="xl"
                                 style={{color: selectedTab.startsWith('setting') ? "#ff5050" : "#ffffff"}}/>
            </div>
        </div>
    )
}
Navbar.propTypes = {};

export default Navbar;