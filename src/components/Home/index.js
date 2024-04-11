import "./index.scss"
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import Constant from "../Utils/Constant";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";
import {WebSocketContext} from "../WebSocket/WebSocketComponent";

const Home = () => {
    const { isAuthenticated, contextStatus, userData } = useContext(UserContext);
    const navigate = useNavigate()
    const [likedUsers, setLikedUsers] = useState([])
    const webSocket = useContext(WebSocketContext);
    useEffect(() => {
        if (isAuthenticated && contextStatus === Constant.CONTEXT_STATUS.SUCCESS) {
            if (userData.isFirstLogin) navigate('/setting/profile?isHideNavBar=true')
            loadUserLikedYou()
        }
        console.log(userData)
    }, [contextStatus, webSocket]);
    const loadUserLikedYou = () => {
        axios.get('users/likedList').then(value => {
            value.data && setLikedUsers(value.data)
        })
    }
    const startChat = (userId) => {
        axios.post('chat', {
            forUserId: userId,
            content: 'start a chat'
        }).then(value => {})
    }

    const MatchItem = ({value, index, startChat}) => {
        const {username, birthYear, bio, avatar, gender, id} = value;
        const age = birthYear > 0 ? `, ${DateUtils.calculateOlds(birthYear)}` : '';
        const genderClass = gender || 'other';

        return (
            <div key={`match-item_${index}`} className={`match-item gap-1 ${genderClass}`} onClick={() => startChat(id)}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48} />
                <div className="flex-grow-1 text-start text-capitalize d-flex flex-column">
                    <span className='fs-3'>{username}{age}</span>
                    <div className='fw-normal bio'>{bio}</div>
                </div>
            </div>
        );
    };

    return (
        userData && <div className="home-wrap">
            <h1>Facebook Action</h1>
            <div className="d-flex gap-3 align-items-center mt-4">
                <Avatar imgKey={userData.avatar} genderKey={userData.gender}></Avatar>
                <span className="fs-2 fw-bold">{userData.username}{userData.birthYear > 0 && <span>, {DateUtils.calculateOlds(userData.birthYear)}</span>}</span>
            </div>
            <h6 className='title'>Cộng đồng</h6>
            <div className="public-chat-wrap">
                <FontAwesomeIcon icon={faGlobe} size={'xl'} style={{color: "#6ec487"}}/>
                <span>Kênh chat chung</span>
            </div>
            <h6 className='title'>Những người đã thích bạn:</h6>
            {
                likedUsers.map((value, index) => (
                    <MatchItem value={value} index={index} startChat={startChat} key={value.id}/>
                ))
            }
        </div>
    )
}
Home.propTypes = {};

export default Home;