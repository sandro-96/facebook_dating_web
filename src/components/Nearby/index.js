import "./index.scss"
import React, {useEffect} from "react";
import Lottie from 'lottie-react';
import animationData from './assests/animation.json';
import animationData2 from './assests/animation2.json';

export const NearBy = () => {

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
                <Lottie animationData={animationData2} />
            </div>
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;