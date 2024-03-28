import "./index.scss"
import {useEffect, useState} from "react";
import {faHeart, faFilter, faBoltLightning} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";

const MAX_LIKE_DAY = 10

export const Match = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const [liked, setLiked] = useState(MAX_LIKE_DAY)
    useEffect(() => {
        loadData()
        getLikedCount()
    }, []);

    const getLikedCount = () => {
        axios.get(`match/count/liked`).then(res => {
            res.data && setLiked(liked - res.data)
        })
    }

    const loadData = () => {
        axios.get(`users/list`).then(res => {
            res.data && setUsers(res.data)
        })
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

    return (
        users &&
        <div className="match-wrap">
            <div className='mb-4 d-flex align-items-center'>
                <h2 className='flex-grow-1'>Match</h2>
                <div className='btn-filter' onClick={event => navigate('/match/filter')}>
                    <span>Bộ lọc</span>
                    <FontAwesomeIcon icon={faFilter} size="xl" style={{color: "#e3e3e3"}}/>
                </div>
            </div>
            <div className="bolt-lightning">
                <FontAwesomeIcon icon={faBoltLightning} size="lg" style={{color: '#ff5050'}}/>
                <span>{liked}</span>
            </div>
            {
                users.map((value, index) => (
                    <div className="d-flex" key={`person_${index}`}>
                        <div key={`match-item_${index}`} className={`match-item ${value.gender ? value.gender : 'other'} gap-1`}>
                            <Avatar imgKey={value.avatar} genderKey={value.gender} sizeKey={48}></Avatar>
                            <div className="flex-grow-1 text-start text-capitalize d-flex flex-column ms-2">
                                <span className='fs-5'>{value.username}{value.birthYear > 0 && <span>, {DateUtils.calculateOlds(value.birthYear)}</span>}</span>
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
        </div>
    )
}
Match.propTypes = {};
export default Match;