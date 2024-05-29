import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import Lottie from 'lottie-react';
import animationData from './assests/animation.json';
import animationData2 from './assests/animation2.json';
import AlertPopup from "../Utils/AlertPopup";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faFilter, faHeart} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "../Avatar";
import DateUtils from "../Utils/DateUtils";
import UserCard from "../UserCard";
import FilterSlideUp from "./FilterSlideUp";
import {UserContext} from "../Context/UserContext";
const PAGE_SIZE = 30;
export const NearBy = () => {
    const { userData } = useContext(UserContext)
    const [isSearching, setIsSearching] = React.useState(false);
    const navigate = useNavigate()
    const [usersLoaded, setUsersLoaded] = React.useState(false);
    const [nearbyUsers, setNearbyUsers] = React.useState([])
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filter, setFilter] = useState(null);
    const  { t } = useTranslation();

    useEffect(() => {
        axios.get(`/match/filter_option`).then(value => {
            if (value.data) {
                setFilter(value.data)
            }
        })
    }, []);
    const updateUserLocation = (long, lat) => {
        axios.patch(`users/location/update?latitude=${lat}&longitude=${long}`).then((value) => {
        })
    }

    const findNearbyUsers = (long, lat, page) => {
        axios.get(`users/nearbyUsers?latitude=${lat}&longitude=${long}&page=${page}&size=${PAGE_SIZE}`).then((response) => {
            if (response && response.data) {
                setNearbyUsers(oldMessages => [...oldMessages, ...response.data.content]);
                setTotalPage(response.data.totalPages);
            }
            setTimeout(() => {
                setIsSearching(false)
                setUsersLoaded(true)
            }, 1000)
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
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const handleChoose = (id) => {
        axios.post('fbd_matches', {
            forUserId: id,
            isFromNearby: true
        }).then(() => {
            let likedUser = nearbyUsers.find(value1 => value1.key === id)
            likedUser.isLikeDisable = true
            setNearbyUsers(nearbyUsers.map(value => value.key === id ? likedUser : value))
        })
    }
    const handleClose = () => {
        setSelectedUser(null)
    }

    const handleNearbyFilter = () => {
        setIsShowFilter(!isShowFilter)
    }

    const applyFilter = (distance, gender) => {
        if (filter) {
            axios.patch(`fbd_filterOptions/${filter.key}`, {
                gender: gender,
                distance: distance
            }).then(value => {
                setFilter(value.data)
                resetFilter()
            })
        } else {
            axios.post(`fbd_filterOptions`, {
                gender: gender,
                distance: distance,
                userId: userData.id
            }).then(value => {
                setFilter(value.data)
                resetFilter()
            })
        }
    }
    const resetFilter = () => {
        setIsSearching(false)
        setUsersLoaded(false)
        setIsShowFilter(false)
        setNearbyUsers([])
    }
    const cancelFilter = (distance, gender) => {
        setIsShowFilter(false)
    }
    const handleBackdropClick = (e) => {
        e.stopPropagation(); // Prevent click events from propagating to elements below the backdrop
    }

    return (
        <div className="nearby-wrap">
            <div className='nearby-header'>
                <div className="d-flex align-items-center gap-2" onClick={() => navigate(-1)}
                     role='button'>
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}}/>
                    <h5 className='flex-grow-1'>{t('nearby.title')}</h5>
                </div>
                <div role="button" className='btn-filter' onClick={handleNearbyFilter}>
                    <span>{t('match.filter')}</span>
                    <FontAwesomeIcon icon={faFilter} size="xl" style={{color: "#e3e3e3"}}/>
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
                                flexWrap: 'wrap',
                                gap: '10px',
                                justifyContent: 'flex-start',
                                marginTop: '20px',
                                alignItems: 'center'
                            }}
                            hasMore={hasMore()}
                            loader={<span>{t('chat.loading')}</span>}
                            scrollableTarget="scrollableDiv"
                        >
                            {
                                nearbyUsers.map((value, index) => (
                                    <div className="circle-item-wrap" key={`person_${index}`}
                                         onClick={() => setSelectedUser(value)}>
                                        <div className="circle-item">
                                            <Avatar imgKey={value.avatar} genderKey={value.gender}></Avatar>
                                        </div>
                                        <span>{value.username}{value.birthYear > 0 &&
                                            <span>, {DateUtils.calculateOlds(value.birthYear)}</span>}</span>
                                    </div>
                                ))
                            }
                        </InfiniteScroll>
                        {
                            selectedUser &&
                            <UserCard deleteMatch={handleClose} startChat={handleChoose} selectedUser={selectedUser}
                                      setSelectedUser={setSelectedUser}></UserCard>
                        }
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
            { isShowFilter &&
                <div onClick={handleBackdropClick} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999, // Ensure the backdrop is above all other elements
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <FilterSlideUp onSave={applyFilter} onCancel={cancelFilter} data={filter}/>
                </div>
            }
        </div>
    )
}
NearBy.propTypes = {};

export default NearBy;