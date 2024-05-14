import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from 'react-router-dom';
import {WebSocketContext} from "../WebSocket/WebSocketComponent";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompass} from "@fortawesome/free-solid-svg-icons";
import RadarGif from "./assests/radar.gif";

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
            <button onClick={checkLocation}>location</button>
            <div className="nearby-content">
                <img src={RadarGif} alt="Description of the gif"/>
                <FontAwesomeIcon size="2xl" icon={faCompass} spin style={{color: "#74C0FC",}}/>
            </div>
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;