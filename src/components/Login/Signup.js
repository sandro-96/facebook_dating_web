import './index.scss'
import { useForm } from 'react-hook-form';
import {createTheme, FormControl, MenuItem, Select, ThemeProvider} from '@mui/material';
import Constant from '../Utils/Constant';
import {useState} from 'react';

const Signup = () => {
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
    const [birthYear, setBirthYear] = useState(new Date().getFullYear());
    const [city, setCity] = useState('Thành phố Hồ Chí Minh');
    const onSubmit = data => {
        console.log(data);
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
        <div className='login-wrap'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className='mb-5'>Đăng ký</h2>
                <div className='login-form'>
                    <input className='form-control' {...register('userName', { required: true })} placeholder='Nhập tên đăng nhập'/>
                    {errors.userName && <div className='error-text'>This field is required</div>}
                    <input type='password' className='form-control' {...register('password', { required: true })} placeholder='Nhập mật khẩu'/>
                    {errors.password && <div className='error-text'>This field is required</div>}
                    <input className='form-control' {...register('name', { required: true })} placeholder='Nhập tên người dùng'/>
                    <div className='gender-wrap'>
                        <div className='form-check first'>
                            <input
                                {...register('gender')}
                                className='form-check-input'
                                type='radio'
                                name='gender'
                                id='exampleRadios1'
                                value='Male'
                                defaultChecked={true}
                            />
                            <label className='form-check-label' htmlFor='exampleRadios1'>
                                Nam
                            </label>
                        </div>
                        <div className='form-check'>
                            <input
                                {...register('gender')}
                                className='form-check-input'
                                type='radio'
                                name='gender'
                                id='exampleRadios2'
                                value='Female'
                            />
                            <label className='form-check-label' htmlFor='exampleRadios2'>
                                Nữ
                            </label>
                        </div>
                    </div>
                    <div className='dropdown-item'>
                        <span className='align-items-center'>Năm sinh của bạn là gì? </span><br/>
                        <ThemeProvider theme={theme}>
                            <FormControl className='customize-form-control' color='purple' size='small'>
                                <Select
                                    displayEmpty
                                    name={'year'}
                                    {...register('birthDay')}
                                    defaultValue={birthYear}
                                    value={birthYear}
                                    onChange={(event) => setBirthYear(event.target.value)}
                                    MenuProps={{
                                        classes: { paper: 'customize-popover' }
                                    }}
                                >
                                    {generateYearOptions()}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                    <div className='dropdown-item'>
                        <span className='align-items-center'>Bạn ở tỉnh nào? </span><br/>
                        <ThemeProvider theme={theme}>
                            <FormControl className='customize-form-control' color='purple' size='small'>
                                <Select
                                    displayEmpty
                                    {...register('location')}
                                    name={'location'}
                                    defaultValue={city}
                                    value={city}
                                    onChange={(event) => setCity(event.target.value)}
                                    MenuProps={{
                                        classes: { paper: 'customize-popover' }
                                    }}
                                >
                                    {generateCityOptions()}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                    <input className='button' type='submit' value='Tạo'/>
                </div>
            </form>
        </div>
    )
}
Signup.propTypes = {};

export default Signup;