import "./index.scss"
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {createTheme, FormControl, MenuItem, Select, ThemeProvider} from "@mui/material";
import Constant from "../Utils/Constant";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVenus, faMars, faVenusMars, faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../Context/UserContext";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Man01 from "../../assets/avatar/man_01.png"
import Man02 from "../../assets/avatar/man_02.png"
import Man03 from "../../assets/avatar/man_03.png"
import Man04 from "../../assets/avatar/man_04.png"
import Man05 from "../../assets/avatar/man_05.png"
import Man06 from "../../assets/avatar/man_06.png"
import Woman01 from "../../assets/avatar/woman_01.png"
import Woman02 from "../../assets/avatar/woman_02.png"
import Woman03 from "../../assets/avatar/woman_03.png"
import Woman04 from "../../assets/avatar/woman_04.png"
import Woman05 from "../../assets/avatar/woman_05.png"
import Woman06 from "../../assets/avatar/woman_06.png"
import Other01 from "../../assets/avatar/other_01.png"
import Other02 from "../../assets/avatar/other_02.png"
import Other03 from "../../assets/avatar/other_03.png"
import Other04 from "../../assets/avatar/other_04.png"
import Other05 from "../../assets/avatar/other_05.png"
import Other06 from "../../assets/avatar/other_06.png"
import Other07 from "../../assets/avatar/other_07.png"
import {useTranslation} from "react-i18next";
import AlertPopup from "../Utils/AlertPopup";

const man_avatars = [Man01, Man02, Man03, Man04, Man05, Man06 ]
const woman_avatars = [Woman01, Woman02, Woman03, Woman04, Woman05, Woman06 ]
const other_avatars = [Other01, Other02, Other03, Other04, Other05, Other06, Other07 ]
export const Profile = () => {
    const { userData, setUserData, contextStatus } = useContext(UserContext);
    const { register, handleSubmit, reset, formState: {errors} } = useForm(
        {defaultValues: userData}
    );
    const [birthYear, setBirthYear] = useState(userData.birthYear || new Date().getFullYear());
    const [city, setCity] = useState(userData.location || 'Thành phố Hồ Chí Minh');
    const [gender, setGender] = useState(userData.gender || 'other');
    const [avatar, setAvatar] = useState(userData.avatar);
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        setCity(userData.location || 'Thành phố Hồ Chí Minh')
        setBirthYear(userData.birthYear || new Date().getFullYear())
        setGender(userData.gender)
        setAvatar(userData.avatar)
        reset(userData)
    }, [contextStatus, reset, userData]);
    const onSubmit = data => {
        let object = {
            username: data.username,
            location: city,
            birthYear: birthYear,
            bio: data.bio
        }
        if (avatar) {
            if ((avatar.startsWith('man') && gender === 'male') || (avatar.startsWith('woman') && gender === 'female') || (avatar.startsWith('other') && gender === 'other')){
                object.avatar = avatar
                object.gender = gender
            } else {
                AlertPopup.error({
                    message: t('message.avatarGenderNotMatch'),
                    okLabel: t('common.ok')
                })
                return
            }
        }
        if (userData.isFirstLogin) object.isFirstLogin = false
        axios.patch(`fbd_users/${userData.key}`, object).then(value => {
            const response = value.data
            response.id = userData.key
            setUserData(response)
            AlertPopup.alert({
                message: t('message.updateSuccess'),
                okLabel: t('common.ok')
            })
        }).finally(() => {
            if (userData.isFirstLogin) {
                setTimeout(() => {
                    navigate('/home')
                }, 1000);
            }
        })
    };

    const generateYearOptions = () => {
        const arr = [];

        const startYear = 1900;
        const endYear = new Date().getFullYear();
        for (let i = endYear; i >= startYear; i--) {
            arr.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
        }

        return arr;
    };
    const generateCityOptions = () => {
        const arr = [];
        Constant.CITY.forEach(value => arr.push(<MenuItem key={value} value={value}>{value}</MenuItem>))
        return arr;
    };

    const theme = createTheme(Constant.BLUE_SELECT_STYLE);
    return (
        <div className='profile-wrap'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='profile-header'>
                    {
                        userData.isFirstLogin ? <div/>
                            :
                            <FontAwesomeIcon icon={faAngleLeft} size="xl" style={{color: "#e3e3e3"}}
                                             onClick={() => navigate(-1)}
                                             role='button'/>
                    }
                    <h5>{t('profile.title')}</h5>
                    <input className='save-btn' type='submit' value={t('common.save')}/>
                </div>
                <div className="profile-content">
                    <div className="profile-item">
                        <span>{t('profile.name')}:</span>
                        <input max={30} className='form-control' {...register('username', {required: true})}
                               placeholder={t('profile.namePlaceholder')}/>
                    </div>
                    <div className="profile-item">
                        <span>{t('profile.introduction')}:</span>
                        <textarea maxLength={200} className='form-control' {...register('bio')}
                                  placeholder={t('profile.describeYourself')}></textarea>
                    </div>
                    <div className="d-flex mt-2">
                        <span className='label-item'>{t('profile.birthYear')}:</span>
                        <ThemeProvider theme={theme}>
                            <FormControl className='customize-form-control' color='blue' size='small'>
                                <Select
                                    displayEmpty
                                    name={'birthYear'}
                                    {...register('birthYear')}
                                    defaultValue={birthYear}
                                    value={birthYear}
                                    onChange={(event) => setBirthYear(event.target.value)}
                                    MenuProps={{
                                        classes: {paper: 'customize-popover'}
                                    }}
                                >
                                    {generateYearOptions()}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                    <div className="d-flex mt-2">
                        <span className='label-item'>{t('profile.city')}:</span>
                        <ThemeProvider theme={theme}>
                            <FormControl className='customize-form-control' color='blue' size='small'>
                                <Select
                                    displayEmpty
                                    {...register('location')}
                                    name={'location'}
                                    defaultValue={city}
                                    value={city}
                                    onChange={(event) => setCity(event.target.value)}
                                    MenuProps={{
                                        classes: {paper: 'customize-popover'}
                                    }}
                                >
                                    {generateCityOptions()}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                    <div className="profile-item">
                        <span>{t('profile.gender')}:</span>
                        <div className='gender-wrap'>
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
                    </div>
                    <div className="profile-item">
                        <span>{t('profile.avatar')}:</span>
                        {
                            gender === 'male' ?
                                <div className='d-flex flex-column gap-2'>
                                    <div className='avatar-wrap'>
                                        {
                                            man_avatars.map((value, index) => (
                                                <img
                                                    onClick={() => setAvatar(`man_0${index + 1}`)}
                                                    className={`${avatar === `man_0${index + 1}` ? 'active' : ''}`}
                                                    key={`man_${index}`} src={value} width={56}
                                                    height={56}
                                                    alt={`man-${index}`}/>
                                            ))
                                        }
                                    </div>
                                </div>
                                : gender === 'female' ?
                                    <div className='d-flex flex-column gap-2'>
                                        <div className='avatar-wrap'>
                                            {
                                                woman_avatars.map((value, index) => (
                                                    <img onClick={() => setAvatar(`woman_0${index + 1}`)}
                                                         className={`${avatar === `woman_0${index + 1}` ? 'active' : ''}`}
                                                         key={`woman_${index}`} src={value} width={56}
                                                         height={56}
                                                         alt={`woman-${index}`}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div className='d-flex flex-column gap-2'>
                                        <div className='avatar-wrap'>
                                            {
                                                other_avatars.map((value, index) => (
                                                    <img onClick={() => setAvatar(`other_0${index + 1}`)}
                                                         className={`${avatar === `other_0${index + 1}` ? 'active' : ''}`}
                                                         key={`other_${index}`} src={value} width={56}
                                                         height={56}
                                                         alt={`other-${index}`}/>
                                                ))
                                            }
                                        </div>
                                    </div>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}
Profile.propTypes = {};

export default Profile;