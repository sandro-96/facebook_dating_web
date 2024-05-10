import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import axios from "axios";
import FeedbackModal from "./FeedbackModal";

const Feedback = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [feedback, setFeedback] = useState([]);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        axios.get(`setting/feedback/getAllByUser`).then(value => {
            value.data && setFeedback(value.data)
        })
    }, []);

    const saveFeedback = (data) => {
        const formData = new FormData();
        formData.append('content', data.content);
        axios.post(`setting/feedback/create`, formData).then(value => {
            value.data && setFeedback([...feedback, value.data])
        }).finally(() => setCreating(false))
    }

    const cancelFeedback = () => {
        setCreating(false);
    }

    return (
        <div className="setting-wrap">
            <div className='d-flex justify-content-between align-items-center match-header'>
                <div style={{width: 78, height: 34}} className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}} onClick={() => navigate('/setting')}
                                     role='button'/>
                </div>
                <h5 className='flex-grow-1'>{t('setting.feedback')}</h5>
                {
                    !creating ?
                    <div className='save-btn' role='button' onClick={() => setCreating(true)}>
                        {t('common.create')}
                    </div> : <div style={{width: 78}}/>
                }
            </div>
            <div className="content-wrap">
                {
                    creating ? (
                        <FeedbackModal saveFeedback={saveFeedback} cancel={cancelFeedback}></FeedbackModal>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {
                                feedback.length === 0 &&
                                <span className="noRecords">{t('setting.noFeedback')}</span>
                            }
                            {
                                feedback.map((item, index) => (
                                    <div className="feedback-item" key={index}>
                                        <div className="feedback-content">
                                            {item.content}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Feedback;