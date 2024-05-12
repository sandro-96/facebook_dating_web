import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import DateUtils from "../Utils/DateUtils";
import Avatar from "../Avatar";
import { useTranslation } from 'react-i18next';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import UserCard from "../UserCard";

const UserLiked = () => {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate()
    const [likedUsers, setLikedUsers] = useState([])
    const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
        loadUserLikedYou()
    }, []);
    const loadUserLikedYou = () => {
        axios.get('users/likedList').then(value => {
            value.data && setLikedUsers(value.data)
        })
    }

    const deleteMatch = (createdBy) => {
        axios.delete(`match/delete?createdBy=${createdBy}`).then(value => {
            setLikedUsers(likedUsers.filter(user => user.id !== createdBy))
        })
    }

    const startChat = (userId) => {
        if (isCreatingTopic) {
            return; // If a topic is already being created, do nothing
        }

        setIsCreatingTopic(true); // Set isCreatingTopic to true before starting the topic creation process

        axios.post('topic/createTopic', {
            forUserId: userId,
            description: t('home.startChat')
        }).then(value => {
            setLikedUsers(likedUsers.filter(user => user.id !== userId))
            navigate(`/chat/${value.data.id}?isHideNavBar=true`, {state: {topicId: value.data.id, userInfo: value.data.user2}})
        }).finally(() => {
            setIsCreatingTopic(false); // Set isCreatingTopic back to false when the topic creation process ends
        });
    }

    const MatchItem = ({value, index, startChat}) => {
        const {username, birthYear, bio, avatar, gender, id} = value;
        const age = birthYear > 0 ? `, ${DateUtils.calculateOlds(birthYear)}` : '';
        const genderClass = gender || 'other';

        return (
            <div key={`match-item_${index}`} className={`match-item gap-1 ${genderClass}`} onClick={() => setSelectedUser(value)}>
                <Avatar imgKey={avatar} genderKey={gender} sizeKey={48} />
                <div className="user-info">
                    <div className='fs-3'>
                        <div className='ellipsis'>{username}{age}</div>
                    </div>
                    <div className='fw-normal bio'>{bio}</div>
                </div>
            </div>
        );
    };

    return (
        userData && <div className="home-wrap p-0">
            <div className='user-liked-header'>
                <div className="d-flex align-items-center gap-2" onClick={() => navigate(-1)}
                     role='button'>
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}}/>
                    <h5 className='flex-grow-1'>{t('home.goBack')}</h5>
                </div>
            </div>
            <div className="user-liked-wrap">
                {
                    likedUsers.length === 0 &&
                    <span className="noRecords">{t('home.noRecord')}</span>
                }
                {
                    likedUsers.map((value, index) => (
                        <MatchItem value={value} index={index} startChat={startChat} key={value.id}/>
                    ))
                }
            </div>
            {
                selectedUser && <UserCard deleteMatch={deleteMatch} startChat={startChat} selectedUser={selectedUser} setSelectedUser={setSelectedUser}></UserCard>
            }
        </div>
    )
}
UserLiked.propTypes = {};

export default UserLiked;