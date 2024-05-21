import React, { useState } from 'react';
import Modal from 'react-modal';
import './index.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faHeart, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

Modal.setAppElement('#root');
const UserCard = ({selectedUser=  null, setSelectedUser, startChat, deleteMatch}) => {
    const { t } = useTranslation();

    const closeModal = () => {
        setSelectedUser(null)
    }
    const match = () => {
        if (selectedUser.isLikeDisable) return
        selectedUser.key && startChat(selectedUser.key)
    }

    const cancel = () => {
        selectedUser.key && deleteMatch(selectedUser.key)
    }

    return (
        <div className="user-card-wrap">
            <Modal
                isOpen={selectedUser !== null}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        maxWidth: 648,
                        margin: 'auto'
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        inset: '50% -80px -80px 50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255,255,255,0.85)',
                        overflow: 'auto',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        border: 'none',
                        borderRadius: '24px',
                        outline: 'none',
                        padding: '20px'
                    }
                }}
                contentLabel="User Info Modal"
            >
                <div className="user-card">
                    <h2>{selectedUser.username}</h2>
                    {
                        selectedUser.gender && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.gender')}:</span> {selectedUser.gender}
                        </div>
                    }
                    {
                        selectedUser.birthYear && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.birthYear')}:</span>  {selectedUser.birthYear}
                        </div>
                    }
                    {
                        selectedUser.location && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.city')}:</span>  {selectedUser.location}
                        </div>
                    }
                    {
                        selectedUser.bio && <div className='fw-normal bio'><span className="fw-bold">Bio:</span> {selectedUser.bio}
                        </div>
                    }
                </div>
                <div className="floating-btn-group">
                    <FontAwesomeIcon onClick={
                        () => {
                            closeModal();
                            cancel()
                        }
                    } icon={faCircleXmark} size="2xl" style={{
                        color: 'rgb(108,107,107)'
                    }}/>
                    <FontAwesomeIcon onClick={match} icon={faHeart} size="2xl" style={{
                        color: selectedUser.isLikeDisable ? 'rgba(145,140,140,0.92)' : 'rgba(183,8,8,0.92)'
                    }}/>
                </div>
            </Modal>
        </div>
    )
}

export default UserCard;