import "./index.scss"
import React, {useEffect} from "react";
import Lottie from 'lottie-react';
import animationData from './assests/animation.json';
import animationData2 from './assests/animation2.json';
import AlertPopup from "../Utils/AlertPopup";
import {useTranslation} from "react-i18next";
import axios from "axios";

export const NearBy = () => {
    const [isSearching, setIsSearching] = React.useState(false);

    const  { t } = useTranslation();
    useEffect(() => {
    }, []);
    const updateUserLocation = (long, lat) => {
        axios.patch(`users/location/update?latitude=${lat}&longitude=${long}`).then((value) => {
        })
    }
    const checkLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setTimeout(() => {
                    setIsSearching(true)
                }, 1000)
                axios.get(`users/nearbyUsers?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
                updateUserLocation(position.coords.longitude, position.coords.latitude)
                console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
            }, positionError => {
                AlertPopup.error({
                    message: t('nearby.error'),
                    okLabel: 'OK'
                })
                console.log(positionError)
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    return (
        <div className="nearby-wrap">
            <h2>{t('nearby.title')}</h2>
            <div className="nearby-content">
                {
                    isSearching ?
                        <div className="text-center">
                            <Lottie animationData={animationData}/>
                            <div>{t('nearby.searching')}</div>
                        </div>
                    :
                    <div>
                        <Lottie animationData={animationData2}/>
                        <div className="start-searching-circle-btn" onClick={checkLocation}>{t('nearby.start')}</div>
                    </div>
                }
            </div>
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;