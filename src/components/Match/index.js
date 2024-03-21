import "./index.scss"
import {useEffect, useState} from "react";
import {faHeart, faFilter, faBoltLightning} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import {useNavigate} from "react-router-dom";

const MAX_LIKE_DAY = 10

export const Match = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const [liked, setLiked] = useState(0)
    useEffect(() => {
        loadData()
        getLikedCount()
    }, []);

    const getLikedCount = () => {
        axios.get(`match/count/liked`).then(res => {
            res.data && setLiked(res.data)
        })
    }

    const loadData = () => {
        axios.get(`users/list`).then(res => {
            res.data && setUsers(res.data)
        })
    }
    const handleChoose = (id) => {
        if (liked >= MAX_LIKE_DAY) return
        axios.post('fbd_matches', {
            forUserId: id
        }).then(() => {
            setLiked(liked + 1)
            setUsers(users.filter(value1 => value1.key !== id))
        })
    }

    return (
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
                <span>{liked > 0 ? liked : ''}</span>
            </div>
            {
                users.map((value, index) => (
                    <div className="d-flex" key={`person_${index}`}>
                        <div className={`match-item ${value.gender ? value.gender : 'other'}`}>
                            <div className="flex-grow-1 text-start text-capitalize d-flex flex-column">
                                <span className='fs-2'>{value.username}{value.birthYear > 0 && <span>, {DateUtils.calculateOlds(value.birthYear)}</span>}</span>
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