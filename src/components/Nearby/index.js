import "./index.scss"
import React, {useEffect, useState} from "react";
import Lottie from 'lottie-react';
import animationData from './assests/animation.json';
import animationData2 from './assests/animation2.json';
import AlertPopup from "../Utils/AlertPopup";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faHeart} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
const PAGE_SIZE = 5;
export const NearBy = () => {
    const [isSearching, setIsSearching] = React.useState(false);
    const navigate = useNavigate()
    const [usersLoaded, setUsersLoaded] = React.useState(false);
    const [nearbyUsers, setNearbyUsers] = React.useState([])
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);

    const  { t } = useTranslation();
    useEffect(() => {
    }, []);
    const updateUserLocation = (long, lat) => {
        axios.patch(`users/location/update?latitude=${lat}&longitude=${long}`).then((value) => {
        })
    }

    const findNearbyUsers = (long, lat) => {
        axios.get(`users/nearbyUsers?latitude=${lat}&longitude=${long}&page=${page}&size=${PAGE_SIZE}`).then((response) => {
            if (response && response.data) {
                setNearbyUsers(oldMessages => [...oldMessages, ...response.data.content]);
                setTotalPage(response.data.totalPages);
            }
            setTimeout(() => {
                setIsSearching(false)
                setUsersLoaded(true)
            }, 5000)
        })
    }
    const fetchMoreData = () => {
        if (page < totalPage - 1) {
            setPage(page + 1); // increment page number
            findNearbyUsers(longitude, latitude, page + 1);
        }
    }

    const hasMore = () => {
        return page < totalPage - 1;
    }
    const checkLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLongitude(position.coords.longitude)
                setLatitude(position.coords.latitude)
                setTimeout(() => {
                    setIsSearching(true)
                    findNearbyUsers(position.coords.longitude, position.coords.latitude, page)
                }, 1000)
                updateUserLocation(position.coords.longitude, position.coords.latitude)
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
            <div className='nearby-header'>
                <div className="d-flex align-items-center gap-2" onClick={() => navigate(-1)}
                     role='button'>
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}}/>
                    <h5 className='flex-grow-1'>{t('nearby.title')}</h5>
                </div>
            </div>
            {
                usersLoaded ?
                    <div className="content-wrap" id="scrollableDiv">
                        {
                            nearbyUsers.length === 0 && <div className='noRecords'>{t('match.noRecord')}</div>
                        }
                        <InfiniteScroll
                            dataLength={nearbyUsers.length}
                            next={fetchMoreData}
                            style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            hasMore={hasMore()}
                            loader={<span>{t('chat.loading')}</span>}
                            scrollableTarget="scrollableDiv"
                        >
                            {
                                nearbyUsers.map((value, index) => (
                                    <div className="d-flex" key={`person_${index}`}>
                                        <div key={`match-item_${index}`}
                                             className={`match-item ${value.gender ? value.gender : 'other'} gap-1`}>
                                            <Avatar imgKey={value.avatar} genderKey={value.gender}
                                                    sizeKey={48}></Avatar>
                                            <div className="user-info">
                                                <div className={`fs-5 ${value.gender}`}>
                                                    <div className='ellipsis'>
                                                        {value.username}{value.birthYear > 0 &&
                                                        <span>, {DateUtils.calculateOlds(value.birthYear)}</span>}
                                                    </div>
                                                </div>
                                                <div className='fw-normal bio'>{value.bio}</div>
                                            </div>
                                        </div>
                                        <div className="heart-icon" onClick={() => {
                                            /*handleChoose(value.key)*/
                                        }}>
                                            <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: '#dc3327'}}/>
                                        </div>
                                    </div>
                                ))
                            }
                        </InfiniteScroll>
                    </div> :
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
                                    <div className="start-searching-circle-btn"
                                         onClick={checkLocation}>{t('nearby.start')}</div>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;