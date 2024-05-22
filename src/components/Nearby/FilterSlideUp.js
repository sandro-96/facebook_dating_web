import "./index.scss"
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import RangeSlider from "react-range-slider-input";
export const FilterSlideUp = ({ onSave, onCancel, data }) => {
    const [gender, setGender] = useState(data ? data.gender : null);
    const [distance, setDistance] = useState([0, data ? data.distance : 30]);
    const { t } = useTranslation();

    const handleApply = () => {
        onSave(distance[1], gender)
    }
    const handleCancel = () => {
        onCancel()
    }
    return (
        <div className="slide-up-wrapper">
            <div className="slide-up">
                <div className='gender-wrap filter-item-content'>
                    <div className={`all d-flex ${gender === null ? 'active' : ''}`}
                         onClick={() => setGender(null)}>
                        <span className="ms-1">{t('filter.all')}</span>
                    </div>
                    <div className={`male d-flex ${gender === 'male' ? 'active' : ''}`}
                         onClick={() => setGender('male')}>
                        <FontAwesomeIcon icon={faMars} size="lg" style={{color: "#e3e3e3"}}/>
                        <span className="ms-1">{t('filter.male')}</span>
                    </div>
                    <div className={`female d-flex ${gender === 'female' ? 'active' : ''}`}
                         onClick={() => setGender('female')}>
                        <FontAwesomeIcon icon={faVenus} size="lg" style={{color: "#e3e3e3"}}/>
                        <span className="ms-1">{t('filter.female')}</span>
                    </div>
                    <div className={`other d-flex ${gender === 'other' ? 'active' : ''}`}
                         onClick={() => setGender('other')}>
                        <FontAwesomeIcon icon={faVenusMars} size="lg" style={{color: "#e3e3e3"}}/>
                        <span className="ms-1">{t('filter.other')}</span>
                    </div>
                </div>
                <div className='age-wrap filter-item-content'>
                    <span className="d-flex flex-wrap">{distance[1]} km</span>
                    <RangeSlider
                        className="single-thumb"
                        defaultValue={distance}
                        thumbsDisabled={[true, false]}
                        rangeSlideDisabled={true}
                        min={0}
                        max={60}
                        step={1}
                        onInput={value => setDistance(value)}
                    />
                </div>
                <div className="d-flex justify-content-center w-100 gap-4">
                    <input className='cancel-btn' type='button' onClick={handleCancel} value={t('common.cancel')}/>
                    <input className='apply-btn' type='button' onClick={handleApply} value={t('common.apply')}/>
                </div>
            </div>
        </div>
    )
}
FilterSlideUp.propTypes = {};

export default FilterSlideUp;