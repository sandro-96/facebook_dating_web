import "./index.scss"
import {useEffect, useState} from "react";
import {faHeart, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import {useLocation, useNavigate} from "react-router-dom";
import _ from 'lodash'

export const Match = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        loadData()
    }, []);

    const loadData = () => {
        axios.get(`users/list`).then(res => {
            res.data && setUsers(res.data)
        })
    }
    const handleChoose = (id) => {
        axios.post('fbd_matches', {
            forUserId: id
        }).then(value => {
            const clone = _.clone(users)
            const index = clone.findIndex(value1 => value1.key === id)
            const obj = clone.find(user => user.key === id)
            obj.liked = true
            clone[index] = obj
            setUsers(clone)
        })
    }

    return (
        <div className="match-wrap">
            <div className='mb-4 d-flex align-items-center'>
                <h2 className='flex-grow-1'>Match</h2>
                <div className='btn-filter' onClick={event => navigate('/match/filter')}>
                    <span>Bộ lọc</span>
                    <FontAwesomeIcon icon={faFilter} size="2xl" style={{color: "#e3e3e3"}}/>
                </div>
            </div>
            {
                users.map((value, index) => (
                    <div className="d-flex" key={`person_${index}`}>
                        <div className={`match-item ${value.gender ? value.gender : 'other'}`}>
                            <div className="flex-grow-1 text-start text-capitalize d-flex flex-column">
                                <span className='fs-2'>{value.username}{value.birthYear > 0 && <span>, {DateUtils.calculateOlds(value.birthYear)}</span>}</span>
                                <span className='fw-normal'>{value.bio}</span>
                            </div>
                        </div>
                        <div className="heart-icon" onClick={() => {
                            if (value.liked) return
                            handleChoose(value.key)
                        }}>
                            <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: `${value.liked ? '#ff5050' : '#e3e3e3'}`}}/>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
Match.propTypes = {};
export default Match;