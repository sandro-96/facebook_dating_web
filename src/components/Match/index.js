import "./index.scss"
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";

export const Match = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [users, setUsers] = useState([]);
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
            <h2 className='mb-4'>Match</h2>
            {
                users.map((value, index) => (
                    <div className="d-flex" key={`person_${index}`}>
                        <div className={`match-item ${value.gender ? value.gender : 'other'}`}>
                            <div className="flex-grow-1 text-start text-capitalize d-flex flex-column">
                                <span className='fs-2'>{value.username}</span>
                                <span className='fw-normal'>{value.bio}</span>
                            </div>
                            {value.birthYear > 0 && <span className='fw-normal'>{DateUtils.calculateOlds(value.birthYear)}</span>}
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