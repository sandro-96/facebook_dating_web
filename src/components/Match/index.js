import "./index.scss"
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";

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
                    <div className="d-flex">
                        <div className={`match-item ${value.gender ? value.gender : 'other'}`}>
                            <span className="flex-grow-1 text-start text-capitalize">{value.username}</span>
                            {value.birthYear > 0 && <span>{value.birthYear}</span>}
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