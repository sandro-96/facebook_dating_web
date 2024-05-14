import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import axios from "axios";
import Avatar from "../Avatar";
import {useNavigate} from 'react-router-dom';
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {useTranslation} from "react-i18next";
import LoaderSpin from "../LoaderSpin";

export const NearBy = () => {
    const { messageWs } = useContext(WebSocketContext);
    const {userData} = useContext(UserContext);
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
    }, []);
    const checkLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    return (
        <div className="nearby-wrap">
            <h2>Nearby</h2>
            <div className="nearby-content">
                <button onClick={checkLocation}>location</button>
            </div>
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;