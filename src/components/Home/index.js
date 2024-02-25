import "./index.scss"
import {useEffect, useState} from "react";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        loadData()
    }, []);
    const loadData = () => {
        const instance = axios.create({
            withCredentials: true,
            baseURL: 'http://localhost:8080/'
        })
        instance.get('group/list').then(value => {
            console.log('dsasdsasdasd')
        }).catch(reason => {
            console.log(reason)
        })
    }
    return (
        <div>
            Home Page
        </div>
    )
}
Home.propTypes = {};

export default Home;