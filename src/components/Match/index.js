import "./index.scss"
import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {faHeart, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import Filter from "./Filter";
import {useNavigate} from "react-router-dom";

export const Match = () => {
    const { userData, setUserData } = useContext(UserContext)
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        loadData()
    }, []);

    const loadData = () => {
        axios.get('users/list?gender=').then(res => {
            res.data && setUsers(res.data)
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
                        <div className="heart-icon">
                            <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: "#e3e3e3"}}/>
                        </div>
                    </div>
                ))
            }
            <div className="d-flex">
                <div className="match-item male">
                    Nguowif banj tot
                </div>
                <div className="heart-icon">
                    <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: "#e3e3e3"}}/>
                </div>
            </div>
            <div className="d-flex">
                <div className="match-item male">
                    Nguowif banj tot
                </div>
                <div className="heart-icon">
                    <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: "#ff5050"}}/>
                </div>
            </div>
        </div>
    )
}
Match.propTypes = {};
export default Match;