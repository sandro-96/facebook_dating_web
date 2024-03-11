import "./index.scss"
import {useContext, useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faMessage, faHouse } from '@fortawesome/free-solid-svg-icons';
import Constant from "../Utils/Constant";
import {UserContext} from "../Context/UserContext";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

export const Navbar = (props) => {
    const { isAuthenticated, contextStatus } = useContext(UserContext);
    const [ selectedTab, setSelectedTab ] = useState('home');
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        setSelectedTab(location.pathname.substring(1))
    }, []);

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
                <FontAwesomeIcon icon={faHouse} size="xl" style={{color: selectedTab === 'home' ? "#ff5050" : "#ffffff" }}/>
            </div>
            <div onClick={() => onSelectTab('match')}
                 className={`nav-item ${selectedTab === 'match' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHeart} size={"xl"} style={{color: selectedTab === 'match' ? "#ff5050" : "#ffffff" }} />
            </div>
            <div onClick={() => onSelectTab('profile')}
                 className={`nav-item ${selectedTab === 'profile' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faUser} size="xl" style={{color: selectedTab === 'profile' ? "#ff5050" : "#ffffff" }}/>
            </div>
        </div>
    )
}
Navbar.propTypes = {};

export default Navbar;