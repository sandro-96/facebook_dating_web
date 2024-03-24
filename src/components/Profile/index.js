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

const man_avatars = [Man01, Man02, Man03, Man04, Man05, Man06 ]
const woman_avatars = [Woman01, Woman02, Woman03, Woman04, Woman05, Woman06 ]
export const Profile = () => {
    const { userData, setUserData, contextStatus } = useContext(UserContext);
    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm(
        {defaultValues: userData}
    );
    const [birthYear, setBirthYear] = useState(userData.birthYear || new Date().getFullYear());
    const [city, setCity] = useState(userData.location ||'Thành phố Hồ Chí Minh');
    const [gender, setGender] = useState(userData.gender || 'other');
    const [avatar, setAvatar] = useState(userData.avatar);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setGender(userData.gender)
        setAvatar(userData.avatar)
        reset(userData)
    }, [contextStatus]);
    const onSubmit = data => {
        let object = {
            username: data.username,
            gender: gender,
            location: city,
            birthYear: birthYear,
            bio: data.bio,
            avatar: avatar
        }
        if (userData.isFirstLogin) object.isFirstLogin = false
        axios.patch(`fbd_users/${userData.key}`, object).then(value => {
            setUserData(value.data)
            setSaveSuccess(true)
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
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    {
                        userData.isFirstLogin ? <div/>
                            :
                            <FontAwesomeIcon icon={faAngleLeft} size="2xl" style={{color: "#e3e3e3"}}
                                             onClick={() => navigate(-1)}
                                             role='button'/>
                    }
                    <h2>Hồ sơ</h2>
                    <input className='save-btn' type='submit' value="Lưu"/>
                </div>
                <div>
                    {
                        saveSuccess && <div className="save-success">Cập nhật thành công!</div>
                    }
                    <div className="d-flex">
                        <span className='label-item'>Tên:</span>
                        <input max={50} className='form-control w-75' {...register('username', {required: true})}
                               placeholder='Nhập tên người dùng'/>
                    </div>
                    <div className="d-flex">
                        <span className='label-item'>Giới thiệu:</span>
                        <textarea maxLength={100} className='form-control w-75' {...register('bio')}
                                  placeholder='Mô tả bản thân'></textarea>
                    </div>
                    <div className="d-flex mt-3">
                        <span className='label-item'>Năm sinh:</span>
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
                    <div className="d-flex mt-4">
                        <span className='label-item'>Thành phố:</span>
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
                    <div className="d-flex mt-4">
                        <span className='label-item'>Giới tính:</span>
                        <div className='gender-wrap'>
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
                    <div className="d-flex mt-4">
                        <span className='label-item'>Avatar:</span>
                        {
                            gender === 'male' ?
                                <div className='d-flex flex-column gap-2'>
                                    <div className='avatar-wrap'>
                                        {
                                            man_avatars.slice(0, 4).map((value, index) => (
                                                <img
                                                    onClick={() => setAvatar(`man_0${index + 1}`)}
                                                    className={`${avatar === `man_0${index + 1}` ? 'active' : ''}`}
                                                    key={`man_${index}`} src={value} width={56}
                                                    height={56}
                                                    alt={`image-${index}`}/>
                                            ))
                                        }
                                    </div>
                                    <div className='avatar-wrap'>
                                        {
                                            man_avatars.slice(4).map((value, index) => (
                                                <img onClick={() => setAvatar(`man_0${index + 5}`)}
                                                     className={`${avatar === `man_0${index + 5}` ? 'active' : ''}`}
                                                     key={`man_${index + 5}`} src={value} width={56} height={56}
                                                     alt={`image-${index + 5}`}/>
                                            ))
                                        }
                                    </div>
                                </div>
                                :
                                <div className='d-flex flex-column gap-2'>
                                    <div className='avatar-wrap'>
                                        {
                                            woman_avatars.slice(0, 4).map((value, index) => (
                                                <img onClick={() => setAvatar(`woman_0${index + 1}`)}
                                                     className={`${avatar === `woman_0${index + 1}` ? 'active' : ''}`}
                                                     key={`woman_${index}`} src={value} width={56}
                                                     height={56}
                                                     alt={`image-woman-${index}`}/>
                                            ))
                                        }
                                    </div>
                                    <div className='avatar-wrap'>
                                        {
                                            woman_avatars.slice(4).map((value, index) => (
                                                <img onClick={() => setAvatar(`woman_0${index + 5}`)}
                                                     className={`${avatar === `woman_0${index + 5}` ? 'active' : ''}`}
                                                     key={`woman_${index + 5}`} src={value} width={56} height={56}
                                                     alt={`image-woman-${index + 5}`}/>
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