import "./index.scss"
import React, {useEffect, useState} from "react";
import {faHeart, faFilter, faBoltLightning} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";
import {useTranslation} from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import LoaderSpin from "../LoaderSpin";

const MAX_LIKE_DAY = 10
const PAGE_SIZE = 30;

export const Match = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const [liked, setLiked] = useState(MAX_LIKE_DAY)
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLikedLoaded, setIsLikedLoaded] = useState(false);
    useEffect(() => {
        loadData(page)
        getLikedCount()
    }, []);

    const getLikedCount = () => {
        axios.get(`match/matched_count`).then(res => {
            res.data && setLiked(liked - res.data)
        }).finally(() => setIsLikedLoaded(true))
    }

    const loadData = (page) => {
        axios.get(`users/list?page=${page}&size=${PAGE_SIZE}`).then(response => {
            console.log(response.data)
            if (response && response.data) {
                setUsers(oldMessages => [...oldMessages, ...response.data.content]);
                setTotalPage(response.data.totalPages);
            }
        }).finally(() => setIsDataLoaded(true))
    }
    const handleChoose = (id) => {
        if (liked === 0) return
        axios.post('fbd_matches', {
            forUserId: id
        }).then(() => {
            setLiked(liked - 1)
            setUsers(users.filter(value1 => value1.key !== id))
        })
    }
    const fetchMoreData = () => {
        if (page < totalPage - 1) {
            setPage(page + 1); // increment page number
            loadData(page + 1);
        }
    }

    const hasMore = () => {
        return page < totalPage - 1;
    }

    return (
        users &&
        <div className="match-wrap">
            <div className="match-header">
                <div className='mb-4 d-flex align-items-center'>
                    <div style={{width: 67}}></div>
                    <h2 className='flex-grow-1'>{t('match.title')}</h2>
                    <div className='btn-filter' onClick={event => navigate('/match/filter')}>
                        <span>{t('match.filter')}</span>
                        <FontAwesomeIcon icon={faFilter} size="xl" style={{color: "#e3e3e3"}}/>
                    </div>
                </div>
                {
                    isLikedLoaded &&
                    <div className="bolt-lightning">
                        <FontAwesomeIcon icon={faBoltLightning} size="lg" style={{color: '#ff5050'}}/>
                        <span>{liked}</span>
                    </div>
                }
            </div>
            {
                !isDataLoaded && <LoaderSpin/>
            }
            {
                isDataLoaded &&
                <div className="content-wrap" id="scrollableDiv">
                    {
                        users.length === 0 && <div className='noRecords'>{t('match.noRecord')}</div>
                    }
                    <InfiniteScroll
                        dataLength={users.length}
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
                            users.map((value, index) => (
                                <div className="d-flex" key={`person_${index}`}>
                                    <div key={`match-item_${index}`}
                                         className={`match-item ${value.gender ? value.gender : 'other'} gap-1`}>
                                        <Avatar imgKey={value.avatar} genderKey={value.gender} sizeKey={48}></Avatar>
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
                                        handleChoose(value.key)
                                    }}>
                                        <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: '#e3e3e3'}}/>
                                    </div>
                                </div>
                            ))
                        }
                    </InfiniteScroll>
                </div>
            }
        </div>
    )
}
Match.propTypes = {};
export default Match;