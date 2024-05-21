import React from 'react';
import Modal from 'react-modal';
import './index.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

Modal.setAppElement('#root');
const UserCardInfo = ({data = null, isOpen = false, closeUserCard}) => {
    const { t } = useTranslation();

    const closeModal = () => {
        closeUserCard()
    }

    return (
        <div className="user-card-wrap">
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
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
                        borderRadius: '20px',
                        outline: 'none',
                        padding: '20px'
                    }
                }}
                contentLabel="User Info Modal"
            >
                <div className="user-card">
                    <h2>{data.username}</h2>
                    {
                        data.gender && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.gender')}:</span> {data.gender}
                        </div>
                    }
                    {
                        data.birthYear && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.birthYear')}:</span>  {data.birthYear}
                        </div>
                    }
                    {
                        data.location && <div className='fw-normal bio'>
                            <span className="fw-bold"> {t('profile.city')}:</span>  {data.location}
                        </div>
                    }
                    {
                        data.bio && <div className='fw-normal bio'><span className="fw-bold">Bio:</span> {data.bio}
                        </div>
                    }
                </div>
                <div className="floating-btn-group">
                    <FontAwesomeIcon onClick={
                        () => {
                            closeModal();
                        }
                    } icon={faCircleXmark} size="2xl" style={{
                        color: 'rgb(108,107,107)'
                    }}/>
                </div>
            </Modal>
        </div>
    )
}

export default UserCardInfo;