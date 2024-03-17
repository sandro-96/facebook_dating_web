import React, {useContext, useEffect, useState} from 'react';
import './index.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faMars, faVenus, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserContext} from "../Context/UserContext";
const Filter = (props) => {
    const { userData, setUserData } = useContext(UserContext)
    const navigate = useNavigate()
    const [gender, setGender] = useState(null);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        axios.get(`/match/filter_option`).then(value => {
            if (value.data) {
                setFilter(value.data)
                setGender(value.data.gender)
            }
        })
    }, []);
    const saveFilter = () => {
        if (filter) {
            axios.patch(`fbd_filterOptions/${filter.id}`, {
                gender: gender
            }).then(value => navigate('/match'))
        } else {
            axios.post(`fbd_filterOptions`, {
                gender: gender,
                userId: userData.id
            }).then(value => navigate('/match'))
        }
    }
    return (
        <div className="match-wrap">
            <div className='mb-4 d-flex justify-content-between align-items-center'>
                <FontAwesomeIcon icon={faAngleLeft} size="2xl" style={{color: "#e3e3e3"}} onClick={() => navigate(-1)} role='button'/>
                <h2 className='flex-grow-1'>Bộ Lọc</h2>
                <div className='save-btn' role='button' onClick={() => saveFilter()}>Lưu</div>
            </div>
            <div className='filter-content'>
                <div className="filter-item">
                    <span className='mb-2 fw-bold'>Giới tính</span>
                    <div className='gender-wrap filter-item-content'>
                        <div className={`male d-flex ${gender === 'male' ? 'active' : ''}`}
                             onClick={() => setGender('male')}>
                            <FontAwesomeIcon icon={faMars} size="lg" style={{color: "#e3e3e3"}}/>
                            <span className="ms-1">Nam</span>
                        </div>
                        <div className={`female d-flex ${gender === 'female' ? 'active' : ''}`}
                             onClick={() => setGender('female')}>
                            <FontAwesomeIcon icon={faVenus} size="lg" style={{color: "#e3e3e3"}}/>
                            <span className="ms-1">Nữ</span>
                        </div>
                        <div className={`other d-flex ${gender === 'other' ? 'active' : ''}`}
                             onClick={() => setGender('other')}>
                            <FontAwesomeIcon icon={faVenusMars} size="lg" style={{color: "#e3e3e3"}}/>
                            <span className="ms-1">Khác</span>
                        </div>
                    </div>
                </div>
                {/*<div className="filter-item">
                    <span className='mb-2 fw-bold'>Độ tuổi</span>
                    <div className="filter-item-content">adsasdasdasd</div>
                </div>*/}
            </div>
        </div>
    );
};

Filter.propTypes = {};

export default Filter;
