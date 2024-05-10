import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import axios from "axios";
import FeedbackModal from "./FeedbackModal";

const HelpSupport = () => {
    const {userData} = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [helpSupport, setHelpSupport] = useState([]);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        axios.get(`setting/help_support/getAllByUser`).then(value => {
            value.data && setHelpSupport(value.data)
        })
    }, []);

    const saveHelpSupport = (data) => {
        const formData = new FormData();
        formData.append('question', data.content);
        axios.post(`setting/help_support/create`, formData).then(value => {
            value.data && setHelpSupport([...helpSupport, value.data])
        }).finally(() => setCreating(false))
    }

    const cancelHelpSupport = () => {
        setCreating(false);
    }

    const disableCreate = () => {
        return helpSupport.length > 0 && helpSupport[helpSupport.length - 1].answer === null
    }

    const renderFeedbackList = () => {
        if (helpSupport.length === 0) {
            return <span className="noRecords">{t('setting.noRequest')}</span>;
        }

        return helpSupport.map((item, index) => (
            <div className="feedback-item" key={index}>
                <div className="feedback-content">
                    <div className="feedback-title">{item.question}</div>
                    <div className="feedback-desc">
                        {item.answer === null ? t('setting.pending') : item.answer}
                    </div>
                </div>
            </div>
        ));
    };

    const handleButtonClick = () => {
        if (!disableCreate()) setCreating(true);
    };

    return (
        <div className="setting-wrap">
            <div className='d-flex justify-content-between align-items-center match-header'>
                <div style={{width: 78, height: 34}} className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}} onClick={() => navigate('/setting')}
                                     role='button'/>
                </div>
                <h5 className='flex-grow-1'>{t('setting.support')}</h5>
                {
                    !creating ?
                        <div className={`save-btn ${disableCreate() && 'disabled'}`} role='button' onClick={handleButtonClick}>
                            {t('common.create')}
                        </div> : <div style={{width: 78}}/>
                }
            </div>
            <div className="content-wrap">
                {creating ? (
                    <FeedbackModal saveFeedback={saveHelpSupport} cancel={cancelHelpSupport}/>
                ) : (
                    <div className="d-flex flex-column gap-2">{renderFeedbackList()}</div>
                )}
            </div>
        </div>
    )
}

export default HelpSupport;