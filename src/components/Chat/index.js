import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";

export const Chat = () => {
    const {userData} = useContext(UserContext);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        loadTopics();
    }, [userData]);

    const loadTopics = async () => {
        try {
            const response = await axios.get(`topic/user/${userData.id}`);
            setTopics(response.data);
        } catch (error) {
            console.error('Failed to load topics:', error);
        }
    };

    const MatchItem = ({value, index}) => {
        const {username, bio, avatar, gender, id} = userData.id === value.user1.id ? value.user2 : value.user1;

        return (
            <div key={`match-item_${index}`} className={`match-item gap-1`}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48} />
                <div className="flex-grow-1 text-start text-capitalize d-flex flex-column ms-2">
                    <span className='fs-3'>{username}</span>
                    <div className='fw-normal bio'>{bio}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="chat-wrap">
            <h2>Đoạn chat</h2>
            <div className="content-wrap">
                {topics.map((topic, index) => (
                    <MatchItem value={topic} index={index}/>
                ))}
            </div>
        </div>
    )
}
Chat.propTypes = {};

export default Chat;