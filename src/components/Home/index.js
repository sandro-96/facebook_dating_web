import "./index.scss"
import {useContext, useEffect} from "react";
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import json from "./assets/data-users.json"

const Home = () => {
    const { isAuthenticated, contextStatus, userData } = useContext(UserContext);
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated && contextStatus === Constant.CONTEXT_STATUS.SUCCESS) {
            if (userData.isFirstLogin) navigate('/profile?isHideNavBar=true')
        }
    }, [contextStatus]);
    return (
        <div className="home-wrap">
            home
        </div>
    )
}
Home.propTypes = {};

export default Home;