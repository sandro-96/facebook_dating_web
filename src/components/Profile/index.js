import "./index.scss"
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {createTheme, FormControl, MenuItem, Select, ThemeProvider} from "@mui/material";
import Constant from "../Utils/Constant";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVenus, faMars, faVenusMars} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../Context/UserContext";
import axios from "axios";

export const Profile = () => {
    const { userData, setUserData } = useContext(UserContext);
    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm(
        {defaultValues: userData}
    );
    const [birthYear, setBirthYear] = useState(userData.birthYear || new Date().getFullYear());
    const [city, setCity] = useState(userData.location ||'Thành phố Hồ Chí Minh');
    const [gender, setGender] = useState(userData.gender || 'other');
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
    }, []);
    const onSubmit = data => {
        let object = {
            username: data.username,
            gender: gender,
            location: city,
            birthYear: birthYear
        }
        axios.patch(`fbd_users/${userData.key}`, object).then(value => setUserData(value.data)).finally(() => setSaveSuccess(true))
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
                <h2 className='mb-4'>Hồ sơ</h2>
                <div>
                    {
                        saveSuccess && <div className="save-success">Cập nhật thành công!</div>
                    }
                    <div className="d-flex">
                        <span className='label-item'>Tên:</span>
                        <input max={50} className='form-control w-75' {...register('username', {required: true})}
                               placeholder='Nhập tên người dùng'/>
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
                    <input className='save-btn' type='submit' value="Cập nhật thông tin"/>
                </div>
            </form>
        </div>
    )
}
Profile.propTypes = {};

export default Profile;