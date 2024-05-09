import "./index.scss"
import React, {useContext} from "react";
import {UserContext} from "../Context/UserContext";
import {useNavigate} from "react-router-dom";
import Avatar from "../Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faCircleQuestion, faRightFromBracket, faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import Constant from "../Utils/Constant";
import {useTranslation} from "react-i18next";

const Feedback = () => {
    const {userData} = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="setting-wrap">
            <div className='d-flex justify-content-between align-items-center match-header'>
                <div style={{width: 78}} className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}} onClick={() => navigate('/setting')}
                                     role='button'/>
                </div>
                <h5 className='flex-grow-1'>{t('setting.feedback')}</h5>
                <div className='save-btn' role='button'>{t('common.create')}</div>
            </div>
            <div className="content-wrap">
                <div className="feedback-item">
                    <div className="feedback-content">
                        <div className="feedback-title">Edited info is updated immediately in Edit Resume and Resume main</div>
                        <div className="feedback-desc">Edited info is updated immediately in Edit Resume and Resume main</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedback;