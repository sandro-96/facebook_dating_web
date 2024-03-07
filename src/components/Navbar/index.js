import "./index.scss"
import {useContext, useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faMessage } from '@fortawesome/free-solid-svg-icons';

export const Navbar = (props) => {
    const { selectedTab, setSelectedTab } = props;
    useEffect(() => {
    }, []);
    const onSelectTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="nav-menu">
            <div onClick={() => onSelectTab('chat')}
                 className={`nav-item ${selectedTab === 'chat' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faMessage} size="xl" style={{color: selectedTab === 'chat' ? "#ff5050" : "#ffffff" }}/>
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